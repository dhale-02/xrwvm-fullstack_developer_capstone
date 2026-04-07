from .models import CarMake, CarModel


def initiate():
    car_make_data = [
        {'name': 'Toyota', 'description': 'Japanese automotive manufacturer'},
        {'name': 'Ford', 'description': 'American automotive manufacturer'},
        {'name': 'Honda', 'description': 'Japanese multinational conglomerate'},
        {'name': 'BMW', 'description': 'German luxury vehicles manufacturer'},
        {'name': 'Chevrolet', 'description': 'American automobile division of GM'},
        {'name': 'Tesla', 'description': 'American electric vehicle manufacturer'},
    ]
    car_model_data = [
        {'name': 'Corolla', 'type': 'SEDAN', 'year': 2023, 'make': 'Toyota'},
        {'name': 'Camry', 'type': 'SEDAN', 'year': 2023, 'make': 'Toyota'},
        {'name': 'RAV4', 'type': 'SUV', 'year': 2023, 'make': 'Toyota'},
        {'name': 'Mustang', 'type': 'COUPE', 'year': 2023, 'make': 'Ford'},
        {'name': 'F-150', 'type': 'TRUCK', 'year': 2023, 'make': 'Ford'},
        {'name': 'Explorer', 'type': 'SUV', 'year': 2023, 'make': 'Ford'},
        {'name': 'Civic', 'type': 'SEDAN', 'year': 2023, 'make': 'Honda'},
        {'name': 'CR-V', 'type': 'SUV', 'year': 2023, 'make': 'Honda'},
        {'name': 'Accord', 'type': 'SEDAN', 'year': 2023, 'make': 'Honda'},
        {'name': '3 Series', 'type': 'SEDAN', 'year': 2023, 'make': 'BMW'},
        {'name': 'X5', 'type': 'SUV', 'year': 2023, 'make': 'BMW'},
        {'name': 'Silverado', 'type': 'TRUCK', 'year': 2023, 'make': 'Chevrolet'},
        {'name': 'Equinox', 'type': 'SUV', 'year': 2023, 'make': 'Chevrolet'},
        {'name': 'Model S', 'type': 'SEDAN', 'year': 2023, 'make': 'Tesla'},
        {'name': 'Model 3', 'type': 'SEDAN', 'year': 2023, 'make': 'Tesla'},
        {'name': 'Model X', 'type': 'SUV', 'year': 2023, 'make': 'Tesla'},
    ]
    for make_data in car_make_data:
        CarMake.objects.get_or_create(name=make_data['name'], defaults={'description': make_data['description']})
    for model_data in car_model_data:
        make = CarMake.objects.get(name=model_data['make'])
        CarModel.objects.get_or_create(
            name=model_data['name'],
            car_make=make,
            defaults={'car_type': model_data['type'], 'year': model_data['year']}
        )
