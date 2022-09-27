from audioop import add
from encodings import utf_8
from mimetypes import init
from select import select
# import sqlalchemy
import pymysql,pymysql.cursors

class DBConnection:
    def __init__(self, user, pwd, address, dbname, port=3306, dbtype='mysql', driver='pymysql') -> None:
        self.conn = pymysql.connect(host=address, port=port, user = user, password=pwd, database=dbname, charset='utf8', ssl={'ssl':{}})
        # self.cursor = self.conn.cursor()
        

    def test_fetch(self):
        sql = 'select * from stu;'
        cursor = self.conn.cursor(cursor=pymysql.cursors.DictCursor)
        cursor.execute(sql)
        ret = cursor.fetchall()
        print(ret)
        return ret
