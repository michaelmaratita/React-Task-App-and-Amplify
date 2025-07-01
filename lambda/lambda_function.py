from dynamodb_handler import DynamoDB

def lambda_handler(event, context):
    ddb = DynamoDB(event)
    items = ddb.main()
    return {
        'statusCode': 200,
        'items': items
    }