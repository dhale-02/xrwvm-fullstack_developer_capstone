from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CarMake, CarModel
from .populate import initiate

MOCK_DEALERS = [
    {"id": 1, "full_name": "Cars Dealership - Manhattan", "city": "New York", "state": "New York", "st": "NY", "address": "1200 Motor Pkwy", "zip": "10001", "lat": "40.7128", "long": "-74.0060"},
    {"id": 2, "full_name": "Cars Dealership - Wichita", "city": "Wichita", "state": "Kansas", "st": "KS", "address": "450 Commerce St", "zip": "67202", "lat": "37.6872", "long": "-97.3301"},
    {"id": 3, "full_name": "Cars Dealership - Kansas City", "city": "Kansas City", "state": "Kansas", "st": "KS", "address": "880 Oak Blvd", "zip": "66101", "lat": "39.1155", "long": "-94.6268"},
    {"id": 4, "full_name": "Cars Dealership - Los Angeles", "city": "Los Angeles", "state": "California", "st": "CA", "address": "4500 Sunset Blvd", "zip": "90028", "lat": "34.0522", "long": "-118.2437"},
    {"id": 5, "full_name": "Cars Dealership - Houston", "city": "Houston", "state": "Texas", "st": "TX", "address": "200 Texas Ave", "zip": "77001", "lat": "29.7604", "long": "-95.3698"},
    {"id": 6, "full_name": "Cars Dealership - Chicago", "city": "Chicago", "state": "Illinois", "st": "IL", "address": "300 Lake Shore Dr", "zip": "60601", "lat": "41.8781", "long": "-87.6298"},
    {"id": 7, "full_name": "Cars Dealership - Phoenix", "city": "Phoenix", "state": "Arizona", "st": "AZ", "address": "1800 Desert Rd", "zip": "85001", "lat": "33.4484", "long": "-112.0740"},
    {"id": 8, "full_name": "Cars Dealership - Seattle", "city": "Seattle", "state": "Washington", "st": "WA", "address": "900 Pine St", "zip": "98101", "lat": "47.6062", "long": "-122.3321"},
]

MOCK_REVIEWS = [
    {"id": 1, "name": "James Wilson", "dealership": 1, "review": "Fantastic services and very professional staff. Highly recommend!", "purchase": True, "purchase_date": "2025-12-15", "car_make": "Toyota", "car_model": "Camry", "car_year": 2023, "sentiment": "positive"},
    {"id": 2, "name": "Emily Davis", "dealership": 1, "review": "Great experience overall. The team was helpful and the process was smooth.", "purchase": True, "purchase_date": "2026-01-10", "car_make": "Honda", "car_model": "Civic", "car_year": 2023, "sentiment": "positive"},
    {"id": 3, "name": "Mike Torres", "dealership": 2, "review": "Good selection of vehicles and fair pricing.", "purchase": True, "purchase_date": "2026-02-05", "car_make": "Ford", "car_model": "F-150", "car_year": 2023, "sentiment": "positive"},
]


def get_dealerships(request, state='All'):
    if state == 'All':
        dealers = MOCK_DEALERS
    else:
        dealers = [d for d in MOCK_DEALERS if d['st'] == state]
    return JsonResponse({'status': 200, 'dealers': dealers})


def get_dealer_details(request, dealer_id):
    dealer = next((d for d in MOCK_DEALERS if d['id'] == dealer_id), None)
    if dealer:
        return JsonResponse({'status': 200, 'dealer': dealer})
    return JsonResponse({'status': 404, 'error': 'Dealer not found'})


def get_dealer_reviews(request, dealer_id):
    reviews = [r for r in MOCK_REVIEWS if r['dealership'] == dealer_id]
    return JsonResponse({'status': 200, 'reviews': reviews})


@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        if not request.user.is_anonymous:
            try:
                data = json.loads(request.body)
                review = data.get('review', data)
                review['id'] = len(MOCK_REVIEWS) + 1
                review['sentiment'] = 'positive'
                MOCK_REVIEWS.append(review)
                return JsonResponse({'status': 200, 'message': 'Review added successfully'})
            except Exception as e:
                return JsonResponse({'status': 500, 'error': str(e)})
        return JsonResponse({'status': 403, 'message': 'Unauthorized - please login first'})
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
