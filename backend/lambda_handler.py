"""
AlignWell MedEd Tool - AWS Lambda Handler
Serverless deployment configuration
"""

import json
import os
from mangum import Mangum
from main import app

# Lambda handler for serverless deployment
handler = Mangum(app, lifespan="off")

def lambda_handler(event, context):
    """
    AWS Lambda handler for AlignWell MedEd Tool
    
    This handler wraps the FastAPI application for serverless deployment.
    It handles API Gateway events and returns appropriate responses.
    """
    
    # Add CORS headers for API Gateway
    if 'headers' not in event:
        event['headers'] = {}
    
    # Set default CORS headers
    event['headers']['Access-Control-Allow-Origin'] = '*'
    event['headers']['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    event['headers']['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
    # Handle preflight OPTIONS requests
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            'body': json.dumps({'message': 'CORS preflight successful'})
        }
    
    # Process the request through Mangum
    response = handler(event, context)
    
    # Add CORS headers to response
    if 'headers' not in response:
        response['headers'] = {}
    
    response['headers']['Access-Control-Allow-Origin'] = '*'
    response['headers']['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['headers']['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
    return response

# For local testing
if __name__ == "__main__":
    # Test event for local development
    test_event = {
        'httpMethod': 'GET',
        'path': '/health',
        'headers': {},
        'queryStringParameters': None,
        'body': None,
        'isBase64Encoded': False
    }
    
    test_context = type('Context', (), {
        'function_name': 'alignwell-meded-tool',
        'function_version': '$LATEST',
        'invoked_function_arn': 'arn:aws:lambda:us-east-1:123456789012:function:alignwell-meded-tool',
        'memory_limit_in_mb': '512',
        'remaining_time_in_millis': lambda: 30000,
        'log_group_name': '/aws/lambda/alignwell-meded-tool',
        'log_stream_name': '2024/01/15/[$LATEST]test',
        'aws_request_id': 'test-request-id'
    })()
    
    result = lambda_handler(test_event, test_context)
    print("Test Result:", json.dumps(result, indent=2))
