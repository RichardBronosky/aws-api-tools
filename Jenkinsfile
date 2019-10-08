pipeline {
    agent any
    environment {
        UI_TEST_JOB = 'GitHub Organization/ui-automation-rtgpr/master'
        ROLE = 'allow-auto-deploy-from-other-accounts'
        TF_MODULE = 'static_site'
        AUTOMATION_USER = 'roomstogodev'
        AUTOMATION_EMAIL = 'Digital_Marketing_Atl_Dev@RoomsToGo.com'
    }
    options{
        lock(resource: "${env.JOB_NAME}")
        timeout(time: 120, unit: "MINUTES")
        parallelsAlwaysFailFast()
    }

    
    stages {
        stage('branch variables') {
            steps {
                script {
                    switch(env.BRANCH_NAME) {
                        case "master":
                            env.WEBSITE_URL = "https://www.rtg-dev.com/"
                            env.CF_ID = "EW96NT2SV6SKQ"
                            env.ACCOUNT_ID = "742127223731"
                            env.ENVIRONMENT = "dev"
                            env.DESTINATION_S3_BUCKET = "roomstogo.com-dev-us-east-1"
                            env.REGIONS = 'SE,TX,FL,OOM'
                            env.ACTIVE_ENV = 'development'
                            env.SLACK = 'rtg_dev_alerts'
                            break

                        case "staging":
                            env.WEBSITE_URL = "https://www.rtg-staging.com/"
                            env.CF_ID = ""
                            env.ACCOUNT_ID = ""
                            env.ENVIRONMENT = "shared"
                            env.DESTINATION_S3_BUCKET = "roomstogo.com-staging-us-east-1"
                            env.REGIONS = 'SE,TX,FL,OOM'
                            env.SLACK = 'rtg_staging_alerts'
                            break
                        case "planning":
                            env.WEBSITE_URL = "https://www.rtg-plan.com/"
                            env.CF_ID = "E183TZU98MK8TU"
                            env.ACCOUNT_ID = "485559245296"
                            env.ENVIRONMENT = "plan"
                            env.DESTINATION_S3_BUCKET = "roomstogo.com-plan-us-east-1"
                            env.REGIONS = 'SE,TX,FL'
                            env.ACTIVE_ENV = 'development'
                            env.NODE_ENV= 'development'
                            break
                        case 'production':
                            env.WEBSITE_URL = "https://www.rtg-prod.com/"
                            env.PREPROD_URL = "https://preprod.rtg-prod.com/"
                            env.CF_ID = "ELD6MR603OV6R"
                            env.PREPROD_CF_ID = "E3TY7YU9UKBMIY"
                            env.ACCOUNT_ID = "224530485594"
                            env.ENVIRONMENT = "prod"
                            env.DESTINATION_S3_BUCKET = "roomstogo.com-prod-us-east-1"
                            env.PREPROD_DESTINATION_S3_BUCKET = "preprod.roomstogo.com-preprod-us-east-1"
                            env.REGIONS = 'SE,TX,FL,OOM'
                            env.ACTIVE_ENV = 'production'
                            env.SLACK = 'rtg_prod_alerts'
                            break
                        default:
                            env.DESTINATION_S3_BUCKET = "rtg-preview-site-${env.BRANCH_NAME.toLowerCase()}"
                            env.ACCOUNT_ID = "742127223731"
                            env.ACTIVE_ENV = 'development'
                            env.REGIONS = 'SE'
                            break
                    }
                }
            }
        }
        stage('Jest Tests') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: 'Node 10.13.0') {
                        sshagent (credentials: ['machine-user-github-ssh-keys'], ignoreMissing: true) {
                            sh '''
                                npm i jest
                                npm run test_coverage
                            '''
                            if(env.BRANCH_NAME == "master") {
                                sh 'npx git+ssh://git@github.com:RoomstoGoDigital/rtg-test-reporting.git --environment "$ENVIRONMENT" --type unit --repo roomstogatsby'
                            }
                        }
                    }
                    githubNotify description: "npm run test succeeded!",
                      targetUrl: env.WEBSITE_URL,
                      status: 'SUCCESS',
                      context: 'Jest Tests'
                }
            }
            post {
                failure {
                    script { 
                        env.FAILURE_STAGE = 'JS Tests'
                        githubNotify description: "npm run test failed!",
                            targetUrl: env.WEBSITE_URL,
                            status: 'FAILURE',
                            context: 'Jest Tests'
                    }
                }
            }
        }
        stage('Build and Deploy Pre Prod') {
            when {
                branch 'production'
            }
            steps {
                script {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        nodejs(nodeJSInstallationName: 'Node 10.13.0') {
                            // Figure out if we should use blue directory or green directory 
                            sh "aws cloudfront get-distribution-config --id ${env.CF_ID} | jq -r '(.DistributionConfig.Origins.Items[0].CustomHeaders.Items[] | select(.HeaderName==\"ORIGIN_PATH\")).HeaderValue' > OriginPath"
                            def CURRENT_DIR = readFile('OriginPath').trim()
                            if (CURRENT_DIR == "/blue") {
                                env.DEPLOY_DIR = "/green"
                            } else if (CURRENT_DIR == "/green") {
                                env.DEPLOY_DIR = "/red"
                            } else {
                                env.DEPLOY_DIR = "/blue"
                            }
                            echo "DEPLOYING TO ${DEPLOY_DIR}"
                            sh """
                              npm ci
                            """
                            stash name: "workspace_${env.BUILD_NUMBER}"
                            def buildAndDeploy = [:]
                            // Copy Files to the DEPLOY_DIR for each bucket
                            for(region in env.REGIONS.split(',')) {
                                echo "Adding ${region} build"
                                def r = region.toString()
                                buildAndDeploy[region] = {
                                    node("gatsby") {
                                        stage("Build and Deploy PreProd ${r}") {
                                            try {
                                                unstash "workspace_${env.BUILD_NUMBER}"
                                                env.NODEJS_HOME = "${tool 'Node 10.13.0'}"
                                                env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
                                                sh """
                                                    ls
                                                    export GET_SECRETS=true
                                                    export GATSBY_RTG_REGION=${r}
                                                    export GATSBY_RELEASE_VERSION=${env.BUILD_NUMBER}
                                                    npm run clear_cache
                                                    npm run build
                                                    cp ./.cache/pages.json ./public/pages.json
                                                    cp ./src/assets/images/favicon/favicon.ico ./public
                                                    echo "$GIT_COMMIT"   > ./public/GIT_COMMIT
                                                    echo "$BUILD_NUMBER" > ./public/BUILD_NUMBER
                                                    echo "$NODE_NAME"    > ./public/BUILD_NODE
                                                    date                 > ./public/BUILD_DATE

                                                    aws s3 sync ./public s3://${env.PREPROD_DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR} --delete --only-show-errors
                                                    aws s3 cp robots.txt s3://${env.PREPROD_DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR}/robots.txt 

                                                    aws s3 sync ./public s3://${env.DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR} --delete --only-show-errors
                                                    aws s3 cp production.robots.txt s3://${env.DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR}/robots.txt 
                                                """
                                            } finally {
                                                deleteDir()
                                            }
                                        }
                                    }
                                }                            
                            }
                            // Wait for jobs to finish in parallel
                            parallel buildAndDeploy
                            // Deploy static site and swap to the new directory
                            sshagent (credentials: ['machine-user-github-ssh-keys'], ignoreMissing: true) {
                                sh '''            
                                    git config --global push.default simple            
                                    git clone git@github.com:RoomstoGoDigital/infrastructure-live.git
                
                                    cd "infrastructure-live/$ENVIRONMENT/$AWS_REGION/$ENVIRONMENT/services/preprod_static_site"
                                    terraform-update-variable --name "origin_path" --value "${DEPLOY_DIR}" --git-user-email "$AUTOMATION_EMAIL" --git-user-name "$AUTOMATION_USER"
                                    terragrunt apply --terragrunt-source-update -input=false -auto-approve -var 'wait_for_deployed=true'
                                '''

                                sh 'rm -rf infrastructure-live'
                            }
                            sh "bash createInvalidation.sh '${env.PREPROD_CF_ID}' '/*'"
                        }
                    }
                }
            }
            post {
                aborted {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        sh '''
                            cd "infrastructure-live/$ENVIRONMENT/us-east-1/$ENVIRONMENT/services/preprod_static_site"
                            terragrunt import aws_cloudfront_distribution.cdn $CF_ID
                        '''
                    }
                }
                failure {
                    script { 
                        env.FAILURE_STAGE = 'Build and Deploy Pre Prod'                        
                    }
                }
            }
        }
        stage('Run Smoke Tests') {
            when {
                branch 'production'
            }
            steps {
                script {
                    def tests = build job: env.UI_TEST_JOB, 
                        wait: true,
                        propagate: false,
                        parameters: [[
                            $class: 'StringParameterValue', 
                            name: 'BASE_URL', 
                            value: env.PREPROD_URL
                        ],
                        [
                            $class: 'StringParameterValue', 
                            name: 'TEST_COMMAND', 
                            value: 'smoke'
                        ]]
                    env.BROWSERSTACK_URL = tests.getBuildVariables().BROWSERSTACK_URL
                    env.UI_TESTS_BUILD_NUMBER = tests.getNumber()
                    def testResult = (['SUCCESS', 'FAILURE', 'ERROR', 'PENDING'].contains(tests.getResult())) ? tests.getResult() : 'FAILURE'
                    sh "echo \"grabbing artifacts for build number: ${env.UI_TESTS_BUILD_NUMBER}\"" 
                    step ([$class: 'CopyArtifact',
                        projectName: env.UI_TEST_JOB,
                        filter: "results/*.xml",
                        target: '.',
                        selector: [$class: 'SpecificBuildSelector', buildNumber: env.UI_TESTS_BUILD_NUMBER]]);

                    step ([$class: 'CopyArtifact',
                        projectName: env.UI_TEST_JOB,
                        filter: "browserstack/browserstack.html",
                        target: '.',
                        selector: [$class: 'SpecificBuildSelector', buildNumber: env.UI_TESTS_BUILD_NUMBER]]);
                    
                    publishHTML (target:[
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        reportDir: './browserstack/',
                        reportFiles: 'browserstack.html',
                        reportName: "Browserstack Report"
                    ])
                    junit 'results/*.xml'
                    if(testResult == 'FAILURE' || testResult == 'ERROR' || testResult == 'UNSTABLE') {
                        error('Smoke Tests Failed')
                    }
                }
            }
            post {
                failure {
                    script { env.FAILURE_STAGE = 'Run Smoke Tests' }
                }
            }
        }
        stage('Deploy to Production') {
            when {
                branch 'production'
            }
            steps {
                script {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        sshagent (credentials: ['machine-user-github-ssh-keys'], ignoreMissing: true) {
                            sh '''            
                                git config --global push.default simple            
                                git clone git@github.com:RoomstoGoDigital/infrastructure-live.git
            
                                cd "infrastructure-live/$ENVIRONMENT/$AWS_REGION/$ENVIRONMENT/services/$TF_MODULE"
                                terraform-update-variable --name "origin_path" --value "${DEPLOY_DIR}" --git-user-email "$AUTOMATION_EMAIL" --git-user-name "$AUTOMATION_USER"
                                terragrunt apply --terragrunt-source-update -input=false -auto-approve -var 'wait_for_deployed=true'
                            '''
                        }
                        sh "bash createInvalidation.sh '${env.CF_ID}' '/*'"
                    }                    
                }
            }
            post {
                aborted {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        sh '''
                            cd "infrastructure-live/$ENVIRONMENT/us-east-1/$ENVIRONMENT/services/$TF_MODULE"
                            terragrunt import aws_cloudfront_distribution.cdn $CF_ID
                        '''
                    }
                }
                failure {
                    script { 
                        env.FAILURE_STAGE = 'Build And Deploy Regions'                        
                    }
                }
            }
        }
        stage('Build and Deploy Regions') {
            when {
                anyOf {
                    branch 'master'
                    branch 'staging'
                    branch 'planning'
                }
            }
            steps {
                script {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        nodejs(nodeJSInstallationName: 'Node 10.13.0') {
                            // Figure out if we should use blue directory or green directory 
                            sh "aws cloudfront get-distribution-config --id ${env.CF_ID} | jq -r '(.DistributionConfig.Origins.Items[0].CustomHeaders.Items[] | select(.HeaderName==\"ORIGIN_PATH\")).HeaderValue' > OriginPath"
                            def CURRENT_DIR = readFile('OriginPath').trim()
                            if (CURRENT_DIR == "/blue") {
                                env.DEPLOY_DIR = "/green"
                            } else if (CURRENT_DIR == "/green") {
                                env.DEPLOY_DIR = "/red"
                            } else {
                                env.DEPLOY_DIR = "/blue"
                            }
                            echo "DEPLOYING TO ${DEPLOY_DIR}"
                            sh """
                              npm ci
                            """
                            stash name: "workspace_${env.BUILD_NUMBER}"
                            def buildAndDeploy = [:]
                            // Copy Files to the DEPLOY_DIR for each bucket
                            for(region in env.REGIONS.split(',')) {
                                echo "Adding ${region} build"
                                def r = region.toString()
                                buildAndDeploy[region] = {
                                    node("gatsby") {
                                        stage("Build and Deploy ${r}") {
                                            try {
                                                unstash "workspace_${env.BUILD_NUMBER}"
                                                env.NODEJS_HOME = "${tool 'Node 10.13.0'}"
                                                env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
                                                sh """
                                                    ls
                                                    export GET_SECRETS=true
                                                    export GATSBY_RTG_REGION=${r}
                                                    export GATSBY_RELEASE_VERSION=${env.BUILD_NUMBER}
                                                    npm run clear_cache
                                                    npm run build
                                                    cp ./.cache/pages.json ./public/pages.json
                                                    cp ./src/assets/images/favicon/favicon.ico ./public
                                                    echo "$GIT_COMMIT"   > ./public/GIT_COMMIT
                                                    echo "$BUILD_NUMBER" > ./public/BUILD_NUMBER
                                                    echo "$NODE_NAME"    > ./public/BUILD_NODE
                                                    date                 > ./public/BUILD_DATE

                                                    aws s3 sync ./public s3://${env.DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR} --delete --only-show-errors
                                                    aws s3 cp robots.txt s3://${env.DESTINATION_S3_BUCKET}-${r.toLowerCase()}${env.DEPLOY_DIR}/robots.txt
                                                """
                                            } finally {
                                                deleteDir()
                                            }
                                        }
                                    }
                                }                            
                            }
                            // Wait for jobs to finish in parallel
                            parallel buildAndDeploy
                            // Deploy static site and swap to the new directory
                            sshagent (credentials: ['machine-user-github-ssh-keys'], ignoreMissing: true) {
                                sh '''            
                                    git config --global push.default simple            
                                    git clone git@github.com:RoomstoGoDigital/infrastructure-live.git
                
                                    cd "infrastructure-live/$ENVIRONMENT/$AWS_REGION/$ENVIRONMENT/services/$TF_MODULE"
                                    terraform-update-variable --name "origin_path" --value "${DEPLOY_DIR}" --git-user-email "$AUTOMATION_EMAIL" --git-user-name "$AUTOMATION_USER"
                                    terragrunt apply --terragrunt-source-update -input=false -auto-approve -var 'wait_for_deployed=true'
                                '''
                            }
                            sh "bash createInvalidation.sh '${env.CF_ID}' '/*'"
                        }
                    }
                }
            }
            post {
                aborted {
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}", duration: 7200) {
                        sh '''
                                cd "infrastructure-live/$ENVIRONMENT/us-east-1/$ENVIRONMENT/services/$TF_MODULE"
                                terragrunt import aws_cloudfront_distribution.cdn $CF_ID
                        '''
                    }
                }
                failure {
                    script { 
                        env.FAILURE_STAGE = 'Build And Deploy Regions'                        
                    }
                }
            }
        }
        stage('Build and Deploy Preview') {
            when {
                not {
                    anyOf {
                        branch 'master'
                        branch 'staging'
                        branch 'planning'
                        branch 'production'
                    }
                }
            }
            agent {
                label 'gatsby'
            }
            steps {
                script {
                    // Get a perview bucket
                    sh "echo About to provision an S3 Bucket for deployment ${env.DESTINATION_S3_BUCKET}"
                    def prov = build job:'service-catalog/provision_site',
                        wait: true,
                        parameters: [[
                            $class: 'StringParameterValue',
                            name: 'BUCKET_NAME',
                            value: env.DESTINATION_S3_BUCKET
                        ]]
                    def prov_env = prov.getBuildVariables()
                    env.WEBSITE_URL = prov_env.website_url
                    // Build site
                    withAWS(region:'us-east-1', roleAccount:"${env.ACCOUNT_ID}", role:"${env.ROLE}") {
                        nodejs(nodeJSInstallationName: 'Node 10.13.0') {
                            sh """
                                ls
                                export GET_SECRETS=true
                                export GATSBY_RTG_REGION=${env.REGIONS}
                                export GATSBY_RELEASE_VERSION=${env.BRANCH_NAME.toLowerCase()}
                                npm ci
                                npm run build
                                cp ./.cache/pages.json ./public/pages.json
                                cp ./src/assets/images/favicon/favicon.ico ./public
                                echo "$GIT_COMMIT"   > ./public/GIT_COMMIT
                                echo "$BUILD_NUMBER" > ./public/BUILD_NUMBER
                                echo "$NODE_NAME"    > ./public/BUILD_NODE
                                date                 > ./public/BUILD_DATE
                                cp robots.txt ./public
                            """
                        }
                    }
                    // Deploy to preview bucket
                    withAWS(region:'us-east-1') {
                        sh "aws s3 sync ./public s3://${env.DESTINATION_S3_BUCKET} --delete --only-show-errors"
                    }
                }
            }
            post {
                failure {
                    script { env.FAILURE_STAGE = 'Build and Deploy Preview' }
                }
            }
        }
        stage('Publish Artifacts') {
            steps {
                script {
                    writeFile file: 'preview/preview.html', text: "<html><script>window.top.location.href=\"${env.WEBSITE_URL}\"</script></html>"

                    publishHTML (target:[
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        reportDir: './preview',
                        reportFiles: 'preview.html',
                        reportName: "Site Preview"
                    ])

                    githubNotify description: "${env.WEBSITE_URL}",
                        targetUrl: env.WEBSITE_URL,
                        status: 'SUCCESS',
                        context: 'Preview Site'
                }
            }
            post {
                failure {
                    script { env.FAILURE_STAGE = 'publish artifacts' }
                }
            }
        }
        stage('Run Functional UI Tests') {
            when {
                anyOf {
                    branch 'master'
                    branch 'staging'
                }
            }
            steps {
                script {
                    def tests = build job: env.UI_TEST_JOB, 
                        wait: true,
                        propagate: false,
                        parameters: [[
                            $class: 'StringParameterValue', 
                            name: 'BASE_URL', 
                            value: env.WEBSITE_URL
                        ]]
                    env.BROWSERSTACK_URL = tests.getBuildVariables().BROWSERSTACK_URL
                    env.UI_TESTS_BUILD_NUMBER = tests.getNumber()
                    def testResult = (['SUCCESS', 'FAILURE', 'ERROR', 'PENDING'].contains(tests.getResult())) ? tests.getResult() : 'FAILURE'
                    sh "echo \"grabbing artifacts for build number: ${env.UI_TESTS_BUILD_NUMBER}\"" 
                    step ([$class: 'CopyArtifact',
                        projectName: env.UI_TEST_JOB,
                        filter: "results/*.xml",
                        target: '.',
                        selector: [$class: 'SpecificBuildSelector', buildNumber: env.UI_TESTS_BUILD_NUMBER]]);

                    step ([$class: 'CopyArtifact',
                        projectName: env.UI_TEST_JOB,
                        filter: "browserstack/browserstack.html",
                        target: '.',
                        selector: [$class: 'SpecificBuildSelector', buildNumber: env.UI_TESTS_BUILD_NUMBER]]);
                    githubNotify description: "Click details to go to BrowserStack test run.",
                        targetUrl: env.BROWSERSTACK_URL,
                        status: testResult,
                        context: 'Browserstack Test Run'
                }
                publishHTML (target:[
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    reportDir: './browserstack/',
                    reportFiles: 'browserstack.html',
                    reportName: "Browserstack Report"
                ])
                junit 'results/*.xml'
            }
            post {
                failure {
                    script { env.FAILURE_STAGE = 'run_tests' }
                }
            }
        }
    }
    post {
        always {
            junit (testResults: 'test_results/*.xml', allowEmptyResults: true)
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Code Coverage'
            ]
            // ======= !! IMPORTANT !! =======
            sh 'chmod -R 777 .' // Required workspace cleanup and deletion
            cleanWs()
        }
        failure {
            slackSend ( color: '#FF0000',
                        channel: env.SLACK,
                        message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' Failed Stage: ${env.FAILURE_STAGE} (${env.BUILD_URL})")
        }
    }
}
