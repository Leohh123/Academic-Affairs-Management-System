SECRET_KEY = 'django-insecure-g(pa!1jw5*8var9%%&s7_+grmbuz=dg2%*p5#o@qg2c%ff7=_)'
DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',  # 数据库引擎
        'NAME': 'mysite',  # 数据库名称
        'HOST': '127.0.0.1',  # 数据库地址，本机 ip 地址 127.0.0.1
        'PORT': 3306,  # 端口
        'USER': 'mysite_admin',  # 数据库用户名
        'PASSWORD': '123456',  # 数据库密码
    }
}
