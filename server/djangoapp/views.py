from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from .models import CarMake, CarModel
from .populate import initiate


def get_dealerships(request, state='All'):
    if state == 'All':
        endpoint = 'http://localhost:3030/fetchDealers'
    else:
        endpoint = f'http://localhost:3030/fetchDealers/{state}'
    try:
        dealerships = requests.get(endpoint).json()
        return JsonResponse({'status': 200, 'dealers': dealerships})
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})


def get_dealer_details(request, dealer_id):
    endpoint = f'http://localhost:3030/fetchDealer/{dealer_id}'
    try:
        dealership = requests.get(endpoint).json()
        return JsonResponse({'status': 200, 'dealer': dealership})
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})


def get_dealer_reviews(request, dealer_id):
    endpoint = f'http://localhost:3030/fetchReviews/dealer/{dealer_id}'
    try:
        reviews = requests.get(endpoint).json()
        for review in reviews:
            sentiment_endpoint = f'http://localhost:5050/analyze/{review["review"]}'
            sentiment = requests.get(sentiment_endpoint).json()
            review['sentiment'] = sentiment.get('sentiment', 'neutral')
        return JsonResponse({'status': 200, 'reviews': reviews})
    except Exception as e:
        return JsonResponse({'status': 500, 'error': str(e)})


@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        if not request.user.is_anonymous:
            data = json.loads(request.body)
            try:
                endpoint = 'http://localhost:3030/insertReview'
                response = requests.post(endpoint, json=data['review'])
                return JsonResponse({'status': 200})
            except Exception as e:
                return JsonResponse({'status': 500, 'error': str(e)})
        return JsonResponse({'status': 403, 'message': 'Unauthorized'})
    return JsonResponse({'status': 405, 'message': 'Method not allowed'})


def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = [{'CarModel': car.name, 'CarMake': car.car_make.name} for car in car_models]
    return JsonResponse({'CarModels': cars})


@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'userName': username, 'status': 'Authenticated'})
    return JsonResponse({'userName': username, 'status': 'Failed'})


@csrf_exempt
def logout_request(request):
    username = request.user.username
    logout(request)
    return JsonResponse({'userName': username})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data.get('userName') or data.get('username')
    password = data.get('password')
    first_name = data.get('firstName') or data.get('firstname', '')
    last_name = data.get('lastName') or data.get('lastname', '')
    email = data.get('email', '')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'userName': username, 'error': 'Already Registered'})
    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password
    )
    login(request, user)
    return JsonResponse({'userName': username, 'status': 'Authenticated'})
