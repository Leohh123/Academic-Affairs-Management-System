# Generated by Django 5.0.2 on 2024-03-01 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0005_rename_id_str_info_member_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="capacity",
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]
