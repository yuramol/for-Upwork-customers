from django.db import models
from config.settings import AUTH_USER_MODEL as User


# Create your models here.
class ChessGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game_id = models.CharField(max_length=50, primary_key=True)
    event = models.CharField(max_length=200)
    site = models.CharField(max_length=100)
    date = models.DateField()
    round = models.CharField(max_length=10, default="-")
    white = models.CharField(max_length=100)
    black = models.CharField(max_length=100)
    result = models.CharField(max_length=50)
    selected_tips = models.CharField(max_length=50)
    tips_found_percent = models.FloatField()
    tips_received_count = models.IntegerField()
    moves = models.TextField()
    moves_count = models.TextField()
    game_time = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Game {self.id} by {self.user.email}"

    class Meta:
        ordering = ['-date', '-created_at']


class ChessMove(models.Model):
    game = models.ForeignKey(ChessGame, on_delete=models.CASCADE)
    move_order_number = models.PositiveIntegerField()
    move_from = models.CharField(max_length=10)
    move_to = models.CharField(max_length=10)
    tip_received = models.BooleanField()
    tip_followed = models.BooleanField()
    best_move = models.CharField(max_length=10)
    move_time_spend = models.PositiveIntegerField()  # in seconds
    cp_diff = models.CharField(max_length=50, blank=True)
    first_pos_cp = models.CharField(max_length=50, blank=True)
    second_pos_cp = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Move {self.move_order_number} of Game {self.game.game_id}"
