
ps -ef | grep "manage.py" | grep -v grep | cut -c 9-16 | xargs kill -9

