from flask import Flask,Response,render_template
from flask_socketio import SocketIO, send ,emit
import time
import threading
import argparse
import datetime
import imutils
#import RPi.GPIO as GPIO          
from time import sleep
import json
import sys
import numpy as np
import turtle
import subprocess
import os
import io
from PIL import Image
import shutil 

from turtle import Turtle, Screen

outputFrame = None
lock = threading.Lock()
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

time.sleep(0.1)
global making_map
making_map = False
global cleaning
cleaning = False

#motor pins for movement
in1 = 22
in2 = 17
in3 = 27
in4 = 25
en4 = 18
en8 = 5

#ultrasonic pins
F_TRIG = 23
F_ECHO = 24
L_TRIG = 26
L_ECHO = 19
R_TRIG = 13  #grey
R_ECHO = 16 # yellow

print("Initializing...")
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(in1,GPIO.OUT)
# GPIO.setup(in2,GPIO.OUT)
# GPIO.setup(in3,GPIO.OUT)
# GPIO.setup(in4,GPIO.OUT)

# GPIO.setup(en4,GPIO.OUT)
# GPIO.setup(en8,GPIO.OUT)
    

# GPIO.setup(F_TRIG,GPIO.OUT)
# GPIO.setup(F_ECHO,GPIO.IN)
# GPIO.setup(L_TRIG,GPIO.OUT)
# GPIO.setup(L_ECHO,GPIO.IN)
# GPIO.setup(R_TRIG,GPIO.OUT)
# GPIO.setup(R_ECHO,GPIO.IN)

# GPIO.output(in1,GPIO.LOW)
# GPIO.output(in2,GPIO.LOW)
# GPIO.output(in3,GPIO.LOW)
# GPIO.output(in4,GPIO.LOW)


# GPIO.output(F_TRIG, False)
# GPIO.output(L_TRIG, False)
# GPIO.output(R_TRIG, False)



# p=GPIO.PWM(en4,1000)
# p1=GPIO.PWM(en8,1000)

# p.start(25)
# p1.start(25)

# p.ChangeDutyCycle(100)
# p1.ChangeDutyCycle(100)

# start = time.time()

# PERIOD_OF_TIME = 180 # 5min

class ROBOT():

    def __init__(self,direction,rows,cols):
        self.direction = "NORTH"
        self.rows = rows
        self.cols = cols
        self.map = np.zeros((self.rows,self.cols))
        self.starting_position = [self.rows//2,self.cols//2]
        self.current_position = [self.rows//2,self.cols//2]
        self.map_formed = False
        self.map[self.current_position[0],self.current_position[1]] = 3
        self.save_map()
        self.values = []
        self.leftmost = []
        self.righmost = []
        self.reached = False
        self.map_complete = False
        self.time = 0
        self.distance = 0
        self.percent = 0
        self.movements = []
        self.final = "NORTH"
        print("[+] Starting position: ",self.current_position)

    def save_map(self):
        print("Saving Map")
        a_file = open("map.txt", "w")
        for row in self.map:
            np.savetxt(a_file, row)
        a_file.close()
    
    def reset_map(self):
        self.map = np.zeros((self.rows,self.cols))
        self.starting_position = [self.rows//2,self.cols//2]
        self.current_position = [self.rows//2,self.cols//2]
        self.map[self.current_position[0],self.current_position[1]] = 3
        self.map_formed = False
        self.values = []
        self.leftmost = []
        self.righmost = []
        self.reached = False
        self.time = 0
        self.time_diff = 0
        self.distance = 0
        self.percent = 0
        self.map_complete = False
        self.movements = []
        self.save_map()
        self.update_values()
        self.direction = "NORTH"
        self.print_map()
        print("[+] Starting position: ",self.current_position)
        print("Map Reset.")

    def load_map(self):
        print("Loading Map..")
        original_array = np.loadtxt("map.txt").reshape(self.rows, self.cols)
        self.map = original_array
    
    def aload_map(self):
        print("Loading Map..")
        original_array = np.loadtxt("temp.txt").reshape(self.rows, self.cols)
        self.map = original_array
    
    def update_values(self):
        p = str(self.percent)+"%"
        val = {"distance":self.distance,"time":self.time_diff,"percent":p,"map":self.map_formed,"map_complete":self.map_complete}
        with open('values.json', 'w') as outfile:
            json.dump(val, outfile)
        print("[+] Updated Values.")

    def calculate_percent(self):
        count_total = 0
        count_done = 0
        for i in range(0,self.rows):
            for j in range(0,self.cols):
                if(self.map[i,j]!=0):
                    count_total +=1
                    if(self.map[i,j]==7):
                        count_done+=1
        percent = (count_done/count_total)*100
        self.percent = percent

    def make_image(self):
        print("Making image")
        turtle.Turtle._screen = None  # force recreation of singleton Screen object
        turtle.TurtleScreen._RUNNING = True 
        m = turtle.Turtle()
        m.color('black', 'light blue')
        m.begin_fill()
        m.penup()
        m.setpos(-100,-100)
        m.pendown()
        #self.current_position = self.starting_position
        m.left(90)
        for i in self.values:
            if(i==1):
                m.forward(50)
            elif(i==4):
                m.forward(50)
                m.left(90)
            elif(i==2):
                m.forward(50)
                m.right(90) 
        # print(m.pos())

        # if(m.pos()!=(0.00,-0.00)):
        #     print("kkkk")
        #     m.forward(50)
        #     print(m.pos())
        # else:
        #     print(m.pos())

        m.end_fill()
        time.sleep(0.3)
        m.getscreen().getcanvas().postscript(file='map.ps')
        ps = open('map.ps')
        m.getscreen().bye()
        psimage=Image.open('map.ps')
        psimage.save('map.png')
        source = os.path.join(os.getcwd(),'map.png')
        destination = os.path.join(os.getcwd(),'static','images','map.png')
        if os.path.exists(destination):
            os.remove(destination)
        dest = shutil.copyfile(source, destination)
        print("[+] Image Saved.")
        m = None

    def save_movements(self):
        turtle.Turtle._screen = None  # force recreation of singleton Screen object
        turtle.TurtleScreen._RUNNING = True 
        print("Making movement image")
        b = turtle.Turtle()
        b.color('black', 'light blue')
        b.hideturtle()           
        b.penup()                
        b.setpos(-100,-100)     
        b.showturtle()          
        b.pendown()
        sleep(3)
        b.begin_fill()
        b.left(90)
        for i in self.values:
            if(i==1):
                b.forward(50)
            elif(i==4):
                b.forward(50)
                b.left(90)
            elif(i==2):
                b.forward(50)
                b.right(90) 

        # if(b.pos()!=(0,0)):
        #     b.forward(50)

        b.setpos(-100,-100)     
        b.end_fill()
        b.color('red', 'yellow')
        b.hideturtle()           
        b.penup()                
        b.setpos(-100,-100)     
        b.showturtle()           
        b.pendown()
        b.pensize(4)
        b.right(90)

        print(self.values)
        print(self.movements)
        # if(self.final=="SOUTH"):
        #     ind = 0
        #     for i in range(len(self.movements)-1,-1,-1):

        #         if(self.movements[i]==7):
        #             ind = i
        #             break
        #     print(ind)   
        #     self.movements = self.movements[0:ind]

        for i in range(len(self.movements),0,-1):
            if(self.movements[i-1]==6 or self.movements[i-1]==7):
                del self.movements[i]
        
        
        print(self.values)
        print(self.movements)

        for i in self.movements:
            if(i==1):
                b.forward(50)
            elif(i==4):
                b.forward(50)
                b.left(90)
            elif(i==8):
                b.backward(50)
            elif(i==2):
                b.forward(50)
                b.right(90)  
            elif(i==6):
                b.forward(50)
                b.right(90)
                b.forward(50) 
                b.right(90)  
            elif(i==7):
                b.forward(50)
                b.left(90)
                b.forward(50) 
                b.left(90)

        b.forward(50) 

        #b.setpos(0, 0)
        time.sleep(0.3)
        b.getscreen().getcanvas().postscript(file='map1.ps')
        ps = open('map1.ps')
        b.getscreen().bye()
        psimage=Image.open('map1.ps')
        psimage.save('map1.png')
        source = os.path.join(os.getcwd(),'map1.png')
        destination = os.path.join(os.getcwd(),'static','images','map1.png')
        if os.path.exists(destination):
            os.remove(destination)
        dest = shutil.copyfile(source, destination)
        print("[+] Movement Map Saved.")
        b = None

    def add_padding(self):
        row_to_be_added = np.zeros((1,self.cols))
        result = np.vstack ((row_to_be_added,self.map) )
        result = np.vstack ((result,row_to_be_added) )
        self.map = result
        self.rows +=2
        self.starting_position[0]+=1

    def follow_map(self):
        self.time = datetime.datetime.now()
        self.time_diff = 0
        self.calculate_percent()
        self.distance = 0
        self.map_complete = False
        self.movements = []
        self.update_values()
        self.load_map()
        #self.add_padding()
        self.starting_position = [self.rows//2,self.cols//2]
        self.current_position = self.starting_position
        self.direction = "NORTH"
        print("[+] Starting position: ",self.current_position)
        self.make_area()
        self.find_leftmost()
        self.find_rightmost()
        self.print_map()
        self.map[self.current_position[0],self.current_position[1]]=7
        sec = 0.5
        rsec = 2.7
        while(not self.leftmost_reached()):
            if(self.direction=="NORTH"):
                if(self.map[self.current_position[0]-1,self.current_position[1]]==1):
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                    self.current_position[0]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                elif(self.map[self.current_position[0]-1,self.current_position[1]]==4):
                    self.current_position[0]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.left(rsec)
                    self.movements.append(4)
                    self.direction = "WEST"
                elif(self.map[self.current_position[0]-1,self.current_position[1]]==2):
                    self.current_position[0]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.right(rsec)
                    self.movements.append(2)
                    self.direction = "EAST"
            elif(self.direction=="WEST"):
                if(self.map[self.current_position[0],self.current_position[1]-1]==1):
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                    self.current_position[1]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                elif(self.map[self.current_position[0],self.current_position[1]-1]==4):
                    self.current_position[1]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.direction = "SOUTH"
                    self.left(rsec)
                    self.movements.append(4)
                elif(self.map[self.current_position[0],self.current_position[1]-1]==2):
                    self.current_position[1]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.right(rsec)
                    self.movements.append(2)
                    self.direction = "NORTH"
            elif(self.direction=="SOUTH"):
                if(self.map[self.current_position[0]+1,self.current_position[1]]==1):
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                    self.current_position[0]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                elif(self.map[self.current_position[0]+1,self.current_position[1]]==4):
                    self.current_position[0]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.left(rsec)
                    self.movements.append(4)
                    self.direction = "EAST"
                elif(self.map[self.current_position[0]+1,self.current_position[1]]==2):
                    self.current_position[0]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.right(rsec)
                    self.movements.append(2)
                    self.direction = "WEST"
            elif(self.direction=="EAST"):
                if(self.map[self.current_position[0]+1,self.current_position[1]+1]==1):
                    self.current_position[1]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                elif(self.map[self.current_position[0]+1,self.current_position[1]+1]==4):
                    self.current_position[1]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.direction = "NORTH"
                    self.left(rsec)
                    self.movements.append(4)
                elif(self.map[self.current_position[0]+1,self.current_position[1]+1]==2):
                    self.current_position[1]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7
                    if(self.leftmost_reached()):
                        break
                    self.right(rsec)
                    self.movements.append(2)
                    self.direction = "SOUTH"
            self.time_diff += (datetime.datetime.now() - self.time).seconds
            self.time = datetime.datetime.now()
            self.calculate_percent()
            self.update_values()
            
        print("leftmost reached.")
        flag = 1
        self.final = "NORTH"
        while(not self.complete() and (not self.rightmost_reached())):
            while(self.map[self.current_position[0],self.current_position[1]+1]==0):
                self.backward(sec)
                self.movements.append(8)
                self.distance+=7
                if(self.direction=="NORTH"):
                    self.current_position[0]+=1
                elif(self.direction=="SOUTH"):
                    self.current_position[0]-=1
            self.stop(0.2)
            dis = self.forward_distance()
            if(dis<10):
                self.backward(sec)
            if(flag==1):
                self.uturn_right(3.8)
                self.movements.append(6)
                flag = 0
            else:
                self.uturn_left(3.8)
                self.movements.append(7)
                flag = 1

            self.distance+=15
            self.current_position[1]+=1
            self.map[self.current_position[0],self.current_position[1]]=7
            if(self.direction=="EAST" or self.direction=="NORTH"):
                self.direction = "SOUTH"
            elif(self.direction=="SOUTH"):
                self.direction = "NORTH"
            if(self.direction=="NORTH"):
                while(self.map[self.current_position[0]-1,self.current_position[1]]!=0):
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                    self.current_position[0]-=1
                    self.map[self.current_position[0],self.current_position[1]]=7
            elif(self.direction=="SOUTH"):
                while(self.map[self.current_position[0]+1,self.current_position[1]]!=0):
                    self.forward(sec)
                    self.movements.append(1)
                    self.distance+=7
                    self.current_position[0]+=1
                    self.map[self.current_position[0],self.current_position[1]]=7

            self.time_diff += (datetime.datetime.now() - self.time).seconds
            self.time = datetime.datetime.now()
            self.calculate_percent()
            self.update_values()
            self.final = self.direction
    
        self.print_map()
        self.time_diff += (datetime.datetime.now() - self.time).seconds
        self.time = datetime.datetime.now()
        self.percent = 100
        self.map_complete = True
        self.update_values()
        global making_map
        making_map = False
        self.save_movements()
        print("Map completed")

    def find_leftmost(self):
        for i in range(0,self.cols):
            for j in range(0,self.rows):
                if(self.map[j,i]!=0):
                    self.leftmost = [j,i]
                    print("left most: ",self.leftmost)
                    return
        
    def leftmost_reached(self):
        if(self.current_position == self.leftmost):
            return True
        else:
            return False
    
    def find_rightmost(self):
        f = False
        for i in range(self.cols-1,-1,-1):
            for j in range(0,self.rows):
                if(self.map[j,i]!=0):
                    self.rightmost = [j,i]
                    f = True
            if(f==True):
                print("rightmost: ",self.rightmost)
                return
            
    def rightmost_reached(self):
        if(self.current_position == self.rightmost):
            print("[+] rightmost reached.")
            return True
        else:
            return False

    def complete(self):
        for i in range(0,self.rows):
            for j in range(0,self.cols):
                if(self.map[i,j]!=0 and self.map[i,j]!=7 ):
                    return False
        print("[+] completed.")
        return True

    def make_area(self):
        #print(self.rows,self.cols)
        # for i in range(0,self.rows-1):
        #     for j in range(0,self.cols):
        #         if(self.map[i,j] == 0 and self.map[i,j-1]!=0 and self.map[i-1,j]!=0 and self.map[i-1,j-1]!=0 and self.map[i,j-1]!=4 and self.map[i-1,j]!=4 and self.map[i-1,j-1]!=4):
        #             self.map[i,j] = 9
        for i in range(0,self.rows-1):
            for j in range(0,self.cols):
                if(self.map[i,j] == 0 and self.map[i,j-1]!=0 and self.map[i-1,j]!=0 and self.map[i-1,j-1]!=0):
                    if(self.map[i-1,j-1]==4 and self.map[i,j-1]!=9 and self.map[i-1,j]!=9):
                        pass
                    else:
                        self.map[i,j] = 9
        # flag = False
        # for i in range(0,self.rows):
        #     flag = False     
        #     for j in range(0,self.cols):
        #         if(self.map[i,j]!=0 and flag==False):
        #             flag = True
        #         elif(self.map[i,j]!=0 and flag==True):
        #             flag = False
        #         elif(self.map[i,j]==0 and flag==True):
        #             self.map[i,j] = 9
        self.print_map()
        # for i in range(0,self.rows):
        #     for j in range(0,self.cols):
        #         if(self.map[i,j]!=0 and self.map[i,j]!=1):
        #             self.map[i,j] = 6  

    def forward_distance(self):
        print("Forward Distance Measurement In Progress")
        sleep(2)
        distance = 0
        # GPIO.output(F_TRIG, True)
        # time.sleep(0.00001)
        # GPIO.output(F_TRIG, False)

        # while GPIO.input(F_ECHO)==0:
        #     pulse_start = time.time()

        # while GPIO.input(F_ECHO)==1:
        #     pulse_end = time.time()

        # pulse_duration = pulse_end - pulse_start

        # distance = pulse_duration * 17150
        # distance = round(distance, 2)
        # print("Forward Distance:",distance,"cm")
        # GPIO.cleanup()
        return distance

    def left_distance(self):
        print("Left Distance Measurement In Progress")
        sleep(2)
        distance = 0
        # GPIO.output(L_TRIG, True)
        # time.sleep(0.00001)
        # GPIO.output(L_TRIG, False)

        # while GPIO.input(L_ECHO)==0:
        #     pulse_start = time.time()

        # while GPIO.input(L_ECHO)==1:
        #     pulse_end = time.time()
        # pulse_duration = pulse_end - pulse_start

        # distance = pulse_duration * 17150
        # distance = round(distance, 2)
        # print("Left Distance:",distance,"cm")
        # #GPIO.cleanup()
        return distance
    
    def right_distance(self):
        print("Right Distance Measurement In Progress")
        sleep(2)
        distance = 0

        # GPIO.output(R_TRIG, True)
        # time.sleep(0.00001)
        # GPIO.output(R_TRIG, False)

        # while GPIO.input(R_ECHO)==0:
        #     pulse_start = time.time()

        # while GPIO.input(R_ECHO)==1:
        #     pulse_end = time.time()
        # pulse_duration = pulse_end - pulse_start

        # distance = pulse_duration * 17150
        # distance = round(distance, 2)
        # print("Right Distance:",distance,"cm")
        # #GPIO.cleanup()
        return distance
    
    def update_map(self, move):

        if(self.direction=="NORTH"):
            self.current_position[0]-=1
        elif(self.direction=="EAST"):
            self.current_position[1]+=1
        elif(self.direction=="SOUTH"):
            self.current_position[0]+=1
        elif(self.direction=="WEST"):
            self.current_position[1]-=1
        
        if(move=="forward"):
            if(self.map[self.current_position[0],self.current_position[1]]==3):
                print("Starting point reached. Map finished.")
                global making_map
                making_map = False
                self.values.append(1)
                self.save_map()
                self.map_formed = True
                self.update_values()
                self.make_image()
                return
            self.map[self.current_position[0],self.current_position[1]] = 1
            self.values.append(1)
        elif(move=="left"):
            self.map[self.current_position[0],self.current_position[1]] = 4
            self.values.append(4)
            self.turn_robot("left")
        elif(move=="right"):
            self.map[self.current_position[0],self.current_position[1]] = 2
            self.values.append(2)
            self.turn_robot("right")

        self.print_map()

    def turn_robot(self,move):
        if(move=="left"):
            if(self.direction=="EAST"):
                self.direction = "NORTH"
            elif(self.direction=="SOUTH"):
                self.direction = "EAST"
            elif(self.direction=="WEST"):
                self.direction = "SOUTH"
            elif(self.direction=="NORTH"):
                self.direction = "WEST"
        elif(move=="right"):
            if(self.direction=="EAST"):
                self.direction = "SOUTH"
            elif(self.direction=="SOUTH"):
                self.direction = "WEST"
            elif(self.direction=="WEST"):
                self.direction = "NORTH"
            elif(self.direction=="NORTH"):
                self.direction = "EAST"

    def uturn_right(self,sec):
        print("right utrun")            
        # GPIO.output(in1,GPIO.HIGH)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.LOW)
        # sleep(sec)
        # self.stop(0.4)
        # self.backward(0.8)
        # self.stop(0.3)
        #GPIO.cleanup()

    def uturn_left(self,sec):
        print("left utrun")            
        # GPIO.output(in1,GPIO.LOW)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.HIGH)
        # sleep(sec)
        # self.stop(0.4)
        # self.backward(0.8)
        # self.stop(0.3)
        #GPIO.cleanup()

    def forward(self,sec):
        print("forward")            
        # GPIO.output(in1,GPIO.LOW)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.LOW)
        # sleep(sec)
        # self.stop(0.3)
        #GPIO.cleanup()

    def backward(self,sec):
        print("backward")
        # GPIO.output(in1,GPIO.HIGH)
        # GPIO.output(in2,GPIO.LOW)
        # GPIO.output(in3,GPIO.LOW)
        # GPIO.output(in4,GPIO.HIGH)
        # sleep(sec)
        # self.stop(0.3)
        #GPIO.cleanup()

    def left(self,sec):
        print("left")   
        # GPIO.output(in1,GPIO.LOW)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.HIGH)
        # sleep(sec)
        # self.stop(0.3)
        # self.backward(0.5)
        # self.stop(0.3)
        #GPIO.cleanup()

    def back_right(self,sec):
        print("back right")
        # GPIO.output(in1,GPIO.HIGH)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.LOW)
        # GPIO.output(in4,GPIO.HIGH)
        # sleep(sec)
        # self.stop(0.3)
        #GPIO.cleanup()

    def back_left(self,sec):
        print("back left")
        # GPIO.output(in1,GPIO.HIGH)
        # GPIO.output(in2,GPIO.LOW)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.LOW)
        # sleep(sec)
        # self.stop(0.3)
        #GPIO.cleanup()

    def right(self,sec):
        print("right")
        # GPIO.output(in1,GPIO.HIGH)
        # GPIO.output(in2,GPIO.HIGH)
        # GPIO.output(in3,GPIO.HIGH)
        # GPIO.output(in4,GPIO.LOW)
        # sleep(sec)
        # self.stop(0.3)
        # self.backward(0.5)
        # self.stop(0.3)
        #GPIO.cleanup()

    def stop(self,sec):
        print("stop")
        # GPIO.output(in1,GPIO.LOW)
        # GPIO.output(in2,GPIO.LOW)
        # GPIO.output(in3,GPIO.LOW)
        # GPIO.output(in4,GPIO.LOW)
        # sleep(sec)
        #GPIO.cleanup()

    def cleanup(self):
        print("Cleaning up")
        # GPIO.cleanup()
    
    def print_map(self):
        print("current direction: ", self.direction)
        print(self.map)

    def comparedistance():
        print("Comparing distance")
        leftd = self.left_distance()
        rightd = self.right_distance()
        if(leftd>rightd):
            print("moving left")
            self.left(0.3)
        elif(rightd>leftd):
            print("moving right")
            self.right(0.3)
        else:
            print("equal")
            self.right(0.3)
            self.stop(0.5)
    
    def obstacle_avoidance():
        distance = self.forward_distance()
        if(distance<20):
            print("changing path")
            self.changepath()
        sleep(0.5)

    def changepath():
        self.stop(0.5)
        self.backward(0.3)
        self.stop(0.2)
        self.right(2)
        self.stop(0.2)
        self.forward(0.6)
        self.stop(0.3)
        self.forward(0.3)
        while(True):
            self.stop(0.2)
            f = self.forward_distance()
            l = self.left_distance()
            if(l>25):
                print("left greater")
                self.backward(0.2)
                self.stop(0.3)
                self.left(2.5)
                self.stop(0.2)
                self.forward(0.6)
                self.stop(0.2)
            elif(f>20):
                print("forward greater")
                self.forward(0.3)
                self.stop(0.2)
            else:
                print("else")
                self.backward(0.3)
                self.stop(0.2)
                self.right(3)
                self.stop(0.2)
                self.forward(0.3)
                self.stop(0.2)

robot = ROBOT("NORTH",20,20)


@app.route('/')
def index():
    return render_template('index1.html')

############################connect#######
@socketio.on('connect')
def test_connect():
    print("Connecting..")
    emit('connection_response','Connection established')
    @socketio.on ('connection')
    def on_connection(c_res):
        print("connection made")
        if(robot is None):
            robot = ROBOT("NORTH",20,20)
        #init()
        print(c_res)

@socketio.on('alarm')
def alarm():
    print("Alarm Reached.")
    robot.follow_map()

@socketio.on('start_cleaning')
def start_cleaning():
    print("Starting Cleaning.")
    robot.follow_map()

@socketio.on('finish_cleaning')
def alarm():
    print("Cleaning Finished.")
    robot.stop(0.5)
    if(robot.map_complete==True):
        emit('finish_response','true')
    else:
        emit('finish_response','false')    

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('reset')
def on_forward_con(*args):
    print("reset")
    robot.reset_map()

@socketio.on('making_map')
def on_forward_con(*args):
    print("making map")
    global making_map
    making_map = True
    robot.reset_map()

@socketio.on('saving_map')
def on_forward_con(*args):
    print("saving map")
    global making_map
    making_map = False

##########Controller Control ###############

@socketio.on('forward_con')
def on_forward_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("forward")
        robot.forward(0.5)
        robot.update_map("forward")   
    if(robot.map_complete==True):
        print("completed.")
        emit('made','true')

@socketio.on('right_con')
def on_right_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("right")
        robot.update_map("right")
        robot.right(2)
    else:
        print("no action.")

@socketio.on('left_con')
def on_left_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("left")
        robot.update_map("left")
        robot.left(2)
    else:
        print("no action.")

@socketio.on('right_uturn_con')
def on_left_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("uturn right")
        #robot.update_map("left")
        robot.uturn_right(3.8)
    else:
        print("no action.")

@socketio.on('left_uturn_con')
def on_left_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("uturn left")
        #robot.update_map("left")
        robot.uturn_left(3.8)
    else:
        print("no action.")

@socketio.on('back_con')
def on_back_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("back")
        robot.backward(0.5)
    else:
        print("no action.")

@socketio.on('stop_con')
def on_stop_con(*args):
    global making_map
    if(making_map==True and robot.map_complete==False):
        print("stop")
        robot.stop(0.5)
    else:
        print("no action.")

@socketio.on('get_info')
def info():
    print("Getting info.")
    with open(os.path.join(os.getcwd(),'values.json')) as f:
        data = json.load(f)
        if(data["map_complete"]=="true"):
            data["percent"] = 100
            emit('cleaning_info',data)
        else:
            emit('cleaning_info',data)

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=5091)
