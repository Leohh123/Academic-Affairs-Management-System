from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class TGender(models.IntegerChoices):
    MALE = 0, _('Male')
    FEMALE = 1, _('Female')


class TUser(models.IntegerChoices):
    STUDENT = 0, _('Student')
    TEACHER = 1, _('Teacher')


# Create your models here.
class Info(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    member_id = models.CharField(max_length=32)
    type = models.IntegerField(choices=TUser)

    class Meta:
        models.Index(fields=['member_id'])

    def __str__(self):
        return f'{{user={self.user}, member_id={self.member_id}, type={self.type}}}'


class Department(models.Model):
    name = models.CharField(max_length=32, primary_key=True)

    def __str__(self):
        return f'{{name={self.name}}}'


class Student(models.Model):
    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=32)
    gender = models.IntegerField(choices=TGender)
    birthday = models.DateField()
    address = models.CharField(max_length=128, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f'{{id={self.id}, name={self.name}, gender={self.gender}, birthday={self.birthday}, address={self.address}, department={self.department.name}}}'


class Teacher(models.Model):
    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=32)
    gender = models.IntegerField(choices=TGender)
    birthday = models.DateField()
    address = models.CharField(max_length=128, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f'{{id={self.id}, name={self.name}, gender={self.gender}, birthday={self.birthday}, address={self.address}, department={self.department.name}}}'


class Course(models.Model):
    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=32)
    time = models.CharField(max_length=128)
    capacity = models.IntegerField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student, through='CourseSelection')

    def __str__(self):
        return f'{{id={self.id}, name={self.name}, time={self.time}, capacity={self.capacity}, teacher={self.teacher}, department={self.department.name}}}'


class CourseSelection(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        unique_together = [['student', 'course']]

    def __str__(self):
        return f'{{id={self.id}, student={self.student.id}, course={self.course.id}, score={self.score}}}'
