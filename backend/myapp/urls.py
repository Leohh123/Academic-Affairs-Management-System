from django.urls import path
from . import views


urlpatterns = [
    path('test', views.test, name='test'),
    path('user/register', views.user_register, name='user-register'),
    path('user/login', views.user_login, name='user-login'),
    path('user/logout', views.user_logout, name='user-logout'),
    path('user/status', views.user_status, name='user-status'),
    path('department/all', views.department_all, name='department-all'),
    path('department/create', views.department_create, name='department-create'),
    path('department/delete', views.department_delete, name='department-delete'),
    path('student/all', views.student_all, name='student-all'),
    path('student/edit', views.student_edit, name='student-edit'),
    path('student/delete', views.student_delete, name='student-delete'),
    path('teacher/all', views.teacher_all, name='teacher-all'),
    path('teacher/edit', views.teacher_edit, name='teacher-edit'),
    path('teacher/delete', views.teacher_delete, name='teacher-delete'),
    path('course/all', views.course_all, name='course-all'),
    path('course/create', views.course_create, name='course-create'),
    path('course/edit', views.course_edit, name='course-edit'),
    path('course/delete', views.course_delete, name='course-delete'),
    path('course-selection/all', views.course_selection_all,
         name='course-selection-all'),
    path('course-selection/create', views.course_selection_create,
         name='course-selection-create'),
    path('course-selection/edit', views.course_selection_edit,
         name='course-selection-edit'),
    path('course-selection/delete', views.course_selection_delete,
         name='course-selection-delete')
]
