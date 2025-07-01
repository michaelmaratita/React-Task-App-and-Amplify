import boto3

client = boto3.client('dynamodb')


class DynamoDB:
    def __init__(self, data):
        self.table = self.get_table()
        self.data = data
        self.key = 'task'
        self.sort = 'complete'

    def get_table(self):
        response = client.list_tables()
        for table in response['TableNames']:
            if 'INPUT TABLE NAME HERE' in table:
                return table

    def scan_items(self):
        response = client.scan(
            TableName = self.table
        )
        return response['Items']

    def format_items(self):
        items = self.scan_items()
        list_items = [{
            k: item[k]['S']
            for k in item.keys()
            }
            for item in items
            ]
        return list_items
    
    def delete_task(self, task):
        client.delete_item(
            TableName = self.table,
            Key = {
                self.key: {
                    'S': task
                }
            }
        )
    
    def new_task(self, task, complete):
        client.put_item(
            TableName = self.table,
            Item = {
                self.key: {
                    'S': task
                },
                self.sort: {
                    'S': complete
                }
            }
        )


    def update_task(self, task, complete):
        client.update_item(
            TableName = self.table,
            Key = {
                self.key: {
                    'S': task
                }
            },
            AttributeUpdates = {
                self.sort: {
                    'Value': {
                        'S': complete
                    },
                    'Action': 'PUT'
                }
            }
        )

    def complete_action(self, keys): 
        function_map = {
            "add": self.new_task,
            "delete": self.delete_task,
            "update": self.update_task
        }
        task = self.data[self.key]
        complete = self.data[self.sort]    
        key = keys[2]
        if self.data[key] == 'delete':
            function = function_map[self.data[key]]
            function(task)
        else:
            function = function_map[self.data[key]]
            function(task, complete)

    def main(self):
        keys = list(self.data)
        if "action" in keys:
            self.complete_action(keys)
        return self.format_items()