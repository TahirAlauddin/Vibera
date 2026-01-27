from django.contrib import admin
from .models import Mood, MoodComment


@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "emoji", "reason_preview", "created_at"]
    list_filter = ["emoji", "created_at"]
    search_fields = ["user__username", "user__email", "reason"]
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "created_at"

    def reason_preview(self, obj):
        """Show preview of reason field"""
        if obj.reason:
            return obj.reason[:50] + "..." if len(obj.reason) > 50 else obj.reason
        return "-"

    reason_preview.short_description = "Reason Preview"


@admin.register(MoodComment)
class MoodCommentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "mood",
        "parent",
        "content_preview",
        "created_at",
        "updated_at",
    ]
    list_filter = ["created_at", "mood"]
    search_fields = ["user__username", "user__email", "content", "mood__id"]
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "created_at"

    def content_preview(self, obj):
        """Show preview of content field"""
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    content_preview.short_description = "Content Preview"
