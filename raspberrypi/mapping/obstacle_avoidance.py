
import RPi.GPIO as GPIO          
from time import sleep
import time
import sys
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

print("Initializing...")
GPIO.setmode(GPIO.BCM)
GPIO.setup(in1,GPIO.OUT)
GPIO.setup(in2,GPIO.OUT)
GPIO.setup(in3,GPIO.OUT)
GPIO.setup(in4,GPIO.OUT)

GPIO.setup(en4,GPIO.OUT)
GPIO.setup(en8,GPIO.OUT)
    

GPIO.setup(F_TRIG,GPIO.OUT)
GPIO.setup(F_ECHO,GPIO.IN)
GPIO.setup(L_TRIG,GPIO.OUT)
GPIO.setup(L_ECHO,GPIO.IN)


GPIO.output(in1,GPIO.LOW)
GPIO.output(in2,GPIO.LOW)
GPIO.output(in3,GPIO.LOW)
GPIO.output(in4,GPIO.LOW)


GPIO.output(F_TRIG, False)
GPIO.output(L_TRIG, False)

p=GPIO.PWM(en4,1000)
p1=GPIO.PWM(en8,1000)

p.start(25)
p1.start(25)

p.ChangeDutyCycle(100)
p1.ChangeDutyCycle(100)

start = time.time()

PERIOD_OF_TIME = 180 # 5min

def forward_distance():
    print("Forward Distance Measurement In Progress")
    sleep(2)

    GPIO.output(F_TRIG, True)
    time.sleep(0.00001)
    GPIO.output(F_TRIG, False)

    while GPIO.input(F_ECHO)==0:
        pulse_start = time.time()

    while GPIO.input(F_ECHO)==1:
        pulse_end = time.time()      

    pulse_duration = pulse_end - pulse_start

    distance = pulse_duration * 17150
    distance = round(distance, 2)
    print("Forward Distance:",distance,"cm")
    #GPIO.cleanup()
    return distance

def left_distance():
    print("Left Distance Measurement In Progress")
    sleep(2)

    GPIO.output(L_TRIG, True)
    time.sleep(0.00001)
    GPIO.output(L_TRIG, False)

    while GPIO.input(L_ECHO)==0:
        pulse_start = time.time()

    while GPIO.input(L_ECHO)==1:
        pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start

    distance = pulse_duration * 17150
    distance = round(distance, 2)
    print("Left Distance:",distance,"cm")
    #GPIO.cleanup()
    return distance
   
def forward(sec):
    print("forward")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)
    #GPIO.cleanup()

def backward(sec):
    print("backward")
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.LOW)
    GPIO.output(in3,GPIO.LOW)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    #GPIO.cleanup()

def left(sec):
    print("left")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)


def back_right(sec):
    print("back right")
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.LOW)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    #GPIO.cleanup()

def back_left(sec):
    print("back left")
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.LOW)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)
    #GPIO.cleanup()

def right(sec):
    print("right")
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)
    #GPIO.cleanup()

def stop(sec):
    print("stop")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
    GPIO.output(in3,GPIO.LOW)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)
    #GPIO.cleanup()

def comparedistance():
    print("Comparing distance")
    leftd = leftdistance()
    rightd = rightdistance()
    if(leftd>rightd):
        print("moving left")
        left(0.3)
    elif(rightd>leftd):
        print("moving right")
        right(0.3)
    else:
        print("equal")
        right(0.3)
        
        stop(0.5)
    

def main():
    while(True):
        distance = forward_distance()
        if(distance<20):
           print("changing path")
           changepath()
        else:
           forward(0.3)
           stop(0.5)
    sleep(0.5)

def changepath():
    stop(0.5)
    backward(0.3)
    stop(0.2)
    right(2.5)
    stop(0.2)
    forward(0.6)
    stop(0.3)
    forward(0.3)
    while(True):
       if time.time() > start + PERIOD_OF_TIME : sys.exit(0) 
       stop(0.2)
       f = forward_distance()
       l = left_distance()
       if(l>25):
          print("left greater")
          backward(0.2)
          stop(0.3)
          left(2.5)
          stop(0.2)
          forward(0.6)
          stop(0.2)
       elif(f>20):
          print("forward greater")
          forward(0.3)
          stop(0.2)
       else:
          print("else")
          backward(0.3)
          stop(0.2)
          right(3)
          stop(0.2)
          forward(0.3)
          stop(0.2)

if __name__ == '__main__':
    stop(0.5)
    while(True):
        try:
            main()
        except KeyboardInterrupt:
            GPIO.cleanup()
            stop(0.5)
            pass
    
