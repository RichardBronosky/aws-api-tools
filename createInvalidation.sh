set -e

# This script will create a cloudfront invalidation and wait for it to complete


function create_invalidation {
  local cf_id="$1"
  local path="$2"

  aws cloudfront create-invalidation --distribution-id "$1" --paths "$2" | jq -r .Invalidation.Id
}

function wait_invalidation {
  local cf_id="$1"
  local invalidation_id="$2"

  local status=$(aws cloudfront get-invalidation --distribution-id "$cf_id" --id "$invalidation_id" | jq -r .Invalidation.Status)
  while [ "$status" != "Completed" ]; do
    sleep 10
    echo "Waiting on invalidation to complete. Status: $status"
    status=$(aws cloudfront get-invalidation --distribution-id "$cf_id" --id "$invalidation_id" | jq -r .Invalidation.Status)
  done
  echo "Invalidation Status: $status"
}

cf_id="$1"
path="$2"

invalidation_id=$(create_invalidation "$cf_id" "$path")
wait_invalidation "$cf_id" "$invalidation_id"

