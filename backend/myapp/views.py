import os
import datetime
from django.db import connection
from django.http import HttpRequest, JsonResponse
from .models import *


# Create your views here.
def resp(data, msg='ok', code=0):
    return JsonResponse({'code': code, 'message': msg, 'data': data})


def test(request: HttpRequest):
    data = int(request.GET['data']) + 1
    return resp(data)


# Debug views
def clear(request: HttpRequest):
    # remove migrations
    views_dirname, _ = os.path.split(__file__)
    migrations_dirname = os.path.join(views_dirname, 'migrations')
    item_names = os.listdir(migrations_dirname)
    removed_items = []
    for name in item_names:
        item_path = os.path.join(migrations_dirname, name)
        if os.path.isfile(item_path) and item_path.find('00') != -1:
            os.remove(item_path)
            removed_items.append(item_path)

    # drop tables
    dropping_tables = []
    dropped_tables = []
    with connection.cursor() as cursor:
        cursor.execute('SHOW TABLES')
        tables = cursor.fetchall()
        for table, *_ in tables:
            # if table.startswith('myapp_'):
            dropping_tables.append(table)
        cnt, max_times = 0, 10
        max_times = 10
        while len(dropping_tables) > 0 and cnt < max_times:
            for table in dropping_tables:
                try:
                    cursor.execute('DROP TABLE ' + table)
                    dropped_tables.append(table)
                except:
                    pass
            cnt += 1

    return resp({
        'dropping_tables': dropping_tables,
        'dropped_tables': dropped_tables,
        'removed_items': removed_items
    })


def init(request: HttpRequest):
    with connection.cursor() as cursor:
        try:
            cursor.execute("INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES (NULL, 'pbkdf2_sha256$720000$KifuqLVZzNsaALdv294Os2$Y06TddNKE/CNaozjNeMzWMLScoIvMAGO4gkvWgGBmQ8=', NULL, '1', 'admin', '', '', 'admin@email.com', '1', '1', '2024-03-02 20:39:29.766089')")
            d = Department.objects.create(name='Computer')
            for i in range(5):
                Student.objects.create(
                    id=f'S00{i}', name=f'stu{i}', gender=i % 2, birthday=datetime.date.today(), department=d)
                t = Teacher.objects.create(
                    id=f'T00{i}', name=f'tea{i}', gender=(i + 1) % 2, birthday=datetime.date.today(), department=d)
                Course.objects.create(
                    id=f'C00{i}', name=f'cou{i}', time='???', teacher=t, department=d)
        except Exception as e:
            return resp(str(e), 'fail', 1)
    return resp(0)
