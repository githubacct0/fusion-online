from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from .serializers import ProductSerializer

@api_view(["POST"])
def handler(request):
    print("---------------")
    print('REQUEST_METHOD:', request.META['REQUEST_METHOD'])
    print('PATH_INFO:', request.META['PATH_INFO'])
    print('CONTENT_TYPE:', request.META['CONTENT_TYPE'])
    print('HTTP_AUTHORIZATION:', request.META['HTTP_AUTHORIZATION'])
    print('HTTP_USER_AGENT:', request.META['HTTP_USER_AGENT'])
    print('HTTP_HOST:', request.META['HTTP_HOST'])
    print("---------------")
    data = JSONParser().parse(request)
    print('REQUEST BODY:', data)
    print("---------------")
    serializer = ProductSerializer(data=data)
    try:
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        else:
            result = serializer.save()
            return Response({"fo_ref_id": result.pk})
    except Exception as e:
        return Response({"error": True, "message": str(e)}, status=500)
