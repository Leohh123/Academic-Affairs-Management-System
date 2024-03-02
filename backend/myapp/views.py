import os
import datetime
import random
import decimal
from django.db import connection
from django.http import HttpRequest, JsonResponse
from django.forms.models import model_to_dict
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import transaction
from .models import *


# Tools
def resp(data, msg='ok', code=0):
    return JsonResponse({'code': code, 'message': msg, 'data': data})


def staff_check(user: User):
    return user.is_staff


def teacher_check(user: User):
    return hasattr(user, 'info') and user.info.type == TUser.TEACHER


def student_check(user: User):
    return hasattr(user, 'info') and user.info.type == TUser.STUDENT


def staff_or_teacher_check(user: User):
    return staff_check(user) or teacher_check(user)


def staff_or_student_check(user: User):
    return staff_check(user) or student_check(user)


def login_check(user: User):
    return not user.is_anonymous


def user_passes_test(test_fn):
    def decorator(view_fn):
        def decorated_fn(request: HttpRequest):
            if not test_fn(request.user):
                return resp('权限不足', 'fail', 400)
            return view_fn(request)
        return decorated_fn
    return decorator


# Common
def test(request: HttpRequest):
    data = int(request.GET['data']) + 1
    return resp(data)


# User
def user_register(request: HttpRequest):
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                request.POST['username'], request.POST['email'], request.POST['password'])
            info = Info.objects.create(
                user=user,
                member_id=request.POST['id'],
                type=int(request.POST['type'])
            )
            kwargs = {
                'id': request.POST['id'],
                'name': request.POST['name'],
                'gender': int(request.POST['gender']),
                'birthday': datetime.date.fromtimestamp(
                    int(request.POST['birthday'])),
                'address': request.POST['address'],
                'department': Department.objects.get(name=request.POST['department'])
            }
            if int(request.POST['type']) == TUser.STUDENT:
                Student.objects.create(**kwargs)
            else:
                Teacher.objects.create(**kwargs)
        return resp('注册成功')
    except Exception as e:
        resp('注册失败', str(e), 1)


def user_login(request: HttpRequest):
    user = authenticate(
        username=request.POST['username'],
        password=request.POST['password']
    )
    if user is not None:
        login(request, user)
        return resp('登录成功')
    return resp('登录失败', 'fail', 1)


def user_logout(request: HttpRequest):
    if not request.user.is_anonymous:
        logout(request)
        return resp('注销成功')
    return resp('您尚未登录', 'fail', 1)


def user_status(request: HttpRequest):
    auth = 0
    if staff_check(request.user):
        auth = 3
    elif teacher_check(request.user):
        auth = 2
    elif login_check(request.user):
        auth = 1
    username = None
    if login_check(request.user):
        username = request.user.username
    return resp({'username': username, 'auth': auth})


# Department
def _department_to_dict(department: Department):
    d = model_to_dict(department)
    d['id'] = department.name
    return d


def department_all(request: HttpRequest):
    departments = Department.objects.all()
    department_list = [_department_to_dict(
        department) for department in departments]
    return resp(department_list)


@user_passes_test(staff_check)
def department_create(request: HttpRequest):
    Department.objects.create(name=request.POST['name'])
    return resp('创建成功')


@user_passes_test(staff_check)
def department_delete(request: HttpRequest):
    department = Department.objects.get(name=request.POST['name'])
    if department is None:
        return resp('学院不存在', 'fail', 2)
    department.delete()
    return resp('删除成功')


# Student
@user_passes_test(staff_or_teacher_check)
def student_all(request: HttpRequest):
    students = Student.objects.all()
    student_list = [model_to_dict(student) for student in students]
    return resp(student_list)


@user_passes_test(staff_check)
def student_edit(request: HttpRequest):
    try:
        with transaction.atomic():
            student = Student.objects.get(id=request.POST['id'])
            if student is None:
                return resp('学号不存在', 'fail', 2)
            student.name = request.POST['name']
            student.gender = int(request.POST['gender'])
            student.birthday = datetime.date.fromtimestamp(
                int(request.POST['birthday']))
            student.address = request.POST['address']
            student.department = Department.objects.get(
                name=request.POST['department'])
            student.save()
        return resp('修改成功')
    except Exception as e:
        return resp('修改失败', str(e), 1)


@user_passes_test(staff_check)
def student_delete(request: HttpRequest):
    try:
        with transaction.atomic():
            student = Student.objects.get(id=request.POST['id'])
            if student is None:
                return resp('学号不存在', 'fail', 2)
            info = Info.objects.get(member_id=student.id)
            if info is not None:
                info.user.delete()
                info.delete()
            student.delete()
        return resp('删除成功')
    except Exception as e:
        return resp('删除失败', str(e), 1)


# Teacher
@user_passes_test(staff_check)
def teacher_all(request: HttpRequest):
    teachers = Teacher.objects.all()
    teacher_list = [model_to_dict(teacher) for teacher in teachers]
    return resp(teacher_list)


@user_passes_test(staff_check)
def teacher_edit(request: HttpRequest):
    try:
        with transaction.atomic():
            teacher = Teacher.objects.get(id=request.POST['id'])
            if teacher is None:
                return resp('工号不存在', 'fail', 2)
            teacher.name = request.POST['name']
            teacher.gender = int(request.POST['gender'])
            teacher.birthday = datetime.date.fromtimestamp(
                int(request.POST['birthday']))
            teacher.address = request.POST['address']
            teacher.department = Department.objects.get(
                name=request.POST['department'])
            teacher.save()
        return resp('修改成功')
    except Exception as e:
        return resp('修改失败', str(e), 1)


@user_passes_test(staff_check)
def teacher_delete(request: HttpRequest):
    try:
        with transaction.atomic():
            teacher = Teacher.objects.get(id=request.POST['id'])
            if teacher is None:
                return resp('工号不存在', 'fail', 2)
            info = Info.objects.get(member_id=teacher.id)
            if info is not None:
                info.user.delete()
                info.delete()
            teacher.delete()
        return resp('删除成功')
    except Exception as e:
        return resp('删除失败', str(e), 1)


# Course
def _course_to_dict(course: Course):
    d = model_to_dict(course, exclude=['students'])
    d['teacher_name'] = course.teacher.name
    d['student_count'] = course.students.count()
    return d


def _has_auth(user: User, course: Course):
    if staff_check(user):
        return True
    return teacher_check(user) and user.info.member_id == course.teacher.id


@login_required
def course_all(request: HttpRequest):
    courses = Course.objects.all()
    course_list = [_course_to_dict(course) for course in courses]
    return resp(course_list)


@user_passes_test(staff_or_teacher_check)
def course_create(request: HttpRequest):
    if staff_check(request.user):
        teacher_id = request.POST['teacher']
    else:
        teacher_id = request.user.info.member_id
    Course.objects.create(
        id=request.POST['id'],
        name=request.POST['name'],
        time=request.POST['time'],
        capacity=int(request.POST['capacity']),
        teacher=Teacher.objects.get(id=teacher_id),
        department=Department.objects.get(name=request.POST['department'])
    )
    return resp('创建成功')


@user_passes_test(staff_or_teacher_check)
def course_edit(request: HttpRequest):
    try:
        with transaction.atomic():
            course = Course.objects.get(id=request.POST['id'])
            if course is None:
                return resp('课程不存在', 'fail', 2)
            if not _has_auth(request.user, course):
                return resp('没有该课程权限', 'fail', 4)
            if not staff_check(request.user) and course.teacher.id != request.POST['teacher']:
                return resp('不可修改主讲教师', 'fail', 3)
            course.name = request.POST['name']
            course.time = request.POST['time']
            course.capacity = int(request.POST['capacity'])
            course.teacher = Teacher.objects.get(id=request.POST['teacher'])
            course.department = Department.objects.get(
                name=request.POST['department'])
            course.save()
        return resp('修改成功')
    except Exception as e:
        return resp('修改失败', str(e), 1)


@user_passes_test(staff_or_teacher_check)
def course_delete(request: HttpRequest):
    try:
        with transaction.atomic():
            course = Course.objects.get(id=request.POST['id'])
            if course is None:
                return resp('课程不存在', 'fail', 2)
            if not _has_auth(request.user, course):
                return resp('没有该课程权限', 'fail', 4)
            course.delete()
        return resp('删除成功')
    except Exception as e:
        return resp('删除失败', str(e), 1)


# Course selection
def _selection_to_dict(selection: CourseSelection):
    s = model_to_dict(selection)
    s['student_name'] = selection.student.name
    s['course_name'] = selection.course.name
    return s


@login_required
def course_selection_all(request: HttpRequest):
    if staff_check(request.user):
        selections = CourseSelection.objects.all()
    elif teacher_check(request.user):
        selections = CourseSelection.objects.filter(
            course__teacher__id=request.user.info.member_id)
    else:
        selections = CourseSelection.objects.filter(
            student__id=request.user.info.member_id)
    selection_list = [
        _selection_to_dict(selection) for selection in selections]
    return resp(selection_list)


@user_passes_test(student_check)
def course_selection_create(request: HttpRequest):
    try:
        with transaction.atomic():
            course = Course.objects.get(id=request.POST['course'])
            if course is None:
                return resp('课程不存在', 'fail', 2)
            if course.students.count() >= course.capacity:
                return resp('课容量已满', 'fail', 3)
            student = Student.objects.get(id=request.user.info.member_id)
            if course.students.contains(student):
                return resp('已选过该课程', 'fail', 4)
            course.students.add(student)
        return resp('选课成功')
    except Exception as e:
        return resp('选课失败', str(e), 1)


@user_passes_test(staff_or_teacher_check)
def course_selection_edit(request: HttpRequest):
    try:
        with transaction.atomic():
            selection = CourseSelection.objects.get(id=request.POST['id'])
            if selection is None:
                return resp('选课记录不存在', 'fail', 2)
            if not staff_check(request.user) and selection.course.teacher.id != request.user.info.member_id:
                return resp('您只能为自己的课程登分', 'fail', 3)
            selection.score = decimal.Decimal(request.POST['score'])
            selection.save()
        return resp('登分成功')
    except Exception as e:
        return resp('登分失败', str(e), 1)


@user_passes_test(staff_or_student_check)
def course_selection_delete(request: HttpRequest):
    try:
        with transaction.atomic():
            selection = CourseSelection.objects.get(id=request.POST['id'])
            if selection is None:
                return resp('选课记录不存在', 'fail', 2)
            if not staff_check(request.user) and selection.student.id != request.user.info.member_id:
                return resp('您只能退选自己的课程', 'fail', 3)
            if selection.score is not None:
                return resp('已有成绩的课程不可退选', 'fail', 4)
            selection.delete()
        return resp('退课成功')
    except Exception as e:
        return resp('退课失败', str(e), 1)


# Debug
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
