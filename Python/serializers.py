from djoser.serializers import UserSerializer
from rest_framework import serializers
from .models import User


class UserProfileSerializer(UserSerializer):
    class Meta:
        model = User
        # fields = '__all__'
        fields = ('email', 'password', 'elo', 'fide_link',
                  'first_name', 'last_name', 'display_name',
                  'location', 'country')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.get('password')
        user = User(**validated_data)
        user.set_password(password)
        user.username = user.email
        user.display_name = user.email.split('@')[0]
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'elo', 'country', 'location', 'fide_link')

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.elo = validated_data.get('elo', instance.elo)
        instance.country = validated_data.get('country', instance.country)
        instance.location = validated_data.get('location', instance.location)
        instance.fide_link = validated_data.get('fide_link', instance.fide_link)
        instance.save()
        return instance
