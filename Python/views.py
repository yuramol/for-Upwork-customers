import json

from rest_framework import generics
from django.http import HttpResponse
from .serializers import ChessGameCreateSerializer, ChessGameListSerializer, ChessMoveSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChessGame, ChessMove
from rest_framework.permissions import IsAuthenticated


class ChessGameAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Получите все записи игр текущего пользователя
        games = ChessGame.objects.filter(user=request.user).order_by('-date', '-created_at')
        serializer = ChessGameListSerializer(games, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        game_serializer = ChessGameCreateSerializer(data=request.data)
        moves_data = request.data.get("moves_details", [])
        moves_serializer = ChessMoveSerializer(data=moves_data, many=True)
        if game_serializer.is_valid() and moves_serializer.is_valid():
            user = request.user
            game_instance = game_serializer.save(user=user)

            for move_data in moves_serializer.validated_data:
                ChessMove.objects.create(game=game_instance, **move_data)

            return Response(game_serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = {}
            if not game_serializer.is_valid():
                errors.update(game_serializer.errors)
            if not moves_serializer.is_valid():
                errors["moves_details"] = moves_serializer.errors

            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class ChessGameDetailView(generics.RetrieveAPIView):
    serializer_class = ChessGameListSerializer

    def get_queryset(self):
        user = self.request.user
        return ChessGame.objects.filter(user=user).order_by('-date', '-created_at')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


def generate_game_file(request, pk):
    try:
        game = ChessGame.objects.get(pk=pk)
        file_content = generate_file(game)
        response = HttpResponse(file_content, content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{game.game_id}.PGN"'

        return response
    except ChessGame.DoesNotExist:
        return HttpResponse(status=404)


def generate_file(game):
    file_content = f"""[Event "{game.event}"]
[Site "{game.site}"]
[Date "{game.date}"]
[Round "{game.round}"]
[White "{game.white}"]
[Black "{game.black}"]
[Result "{game.result}"]

{game.moves}
"""
    return file_content
