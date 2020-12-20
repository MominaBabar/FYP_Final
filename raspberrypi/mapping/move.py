import RPi.GPIO as GPIO          
from time import sleep

in1 = 22
in2 = 17
in3 = 27
in4 = 25
en4 = 18
en8 = 5

print("initializing")
GPIO.setmode(GPIO.BCM)
GPIO.setup(in1,GPIO.OUT)
GPIO.setup(in2,GPIO.OUT)
GPIO.setup(in3,GPIO.OUT)
GPIO.setup(in4,GPIO.OUT)

GPIO.setup(en4,GPIO.OUT)
GPIO.setup(en8,GPIO.OUT)

GPIO.output(in1,GPIO.LOW)
GPIO.output(in2,GPIO.LOW)
GPIO.output(in3,GPIO.LOW)
GPIO.output(in4,GPIO.LOW)


p=GPIO.PWM(en4,1000)
p1=GPIO.PWM(en8,1000)

p.start(25)
p1.start(25)

p.ChangeDutyCycle(100)
p1.ChangeDutyCycle(100)


def backward(sec):
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    GPIO.cleanup()

def forward(sec):
    
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)
    GPIO.cleanup()

def left(sec):
    
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.LOW)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    GPIO.cleanup()

def back_left(sec):
    print("back left")
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.HIGH)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    #GPIO.cleanup()


def right(sec):
    
    GPIO.output(in1,GPIO.HIGH)
    GPIO.output(in2,GPIO.LOW)
    GPIO.output(in3,GPIO.HIGH)
    GPIO.output(in4,GPIO.HIGH)
    sleep(sec)
    GPIO.cleanup()

def stop(sec):
    
    GPIO.output(in1,GPIO.LOW)
    GPIO.output(in2,GPIO.LOW)
    GPIO.output(in3,GPIO.LOW)
    GPIO.output(in4,GPIO.LOW)
    sleep(sec)



print("\n")
print("--------------------------------------------------")
print("Press: w-forward s-backward a-left d-right x-stop q-quit")
print("--------------------------------------------------")
print("\n")    
while(1):
    
    x=input("enter direction: ")
    sec = 0.5
    rsec = 2
    usec = 4.8
    lsec = 2
    print(x)
    if x=="x":
        print("stop")
        #stop(3)
        GPIO.output(in1,GPIO.LOW)
        GPIO.output(in2,GPIO.LOW)
        GPIO.output(in3,GPIO.LOW)
        GPIO.output(in4,GPIO.LOW)
        sleep(sec)
        #GPIO.cleanup()
    elif x=="s":
        print("backward")
        #forward(3)
        GPIO.output(in1,GPIO.HIGH)
        GPIO.output(in2,GPIO.LOW)
        GPIO.output(in3,GPIO.LOW)
        GPIO.output(in4,GPIO.HIGH)
        sleep(sec)
        stop(0.3)
        #GPIO.cleanup()
    elif x=="a":
        print("left")
        #forward(3)
        GPIO.output(in1,GPIO.LOW)
        GPIO.output(in2,GPIO.HIGH)
        GPIO.output(in3,GPIO.HIGH)
        GPIO.output(in4,GPIO.HIGH)
        sleep(lsec)
        stop(0.3)
        #GPIO.cleanup()
    elif x=="d":
        print("right")
        #forward(3)
        GPIO.output(in1,GPIO.HIGH)
        GPIO.output(in2,GPIO.HIGH)
        GPIO.output(in3,GPIO.HIGH)
        GPIO.output(in4,GPIO.LOW)
        sleep(rsec)
        stop(0.3)
        #GPIO.cleanup()

    elif x=='w':
        print("forward")
        #backward(3)
        GPIO.output(in1,GPIO.LOW)
        GPIO.output(in2,GPIO.HIGH)
        GPIO.output(in3,GPIO.HIGH)
        GPIO.output(in4,GPIO.LOW)
        sleep(sec)
        stop(0.3)
        #GPIO.cleanup()
    elif x=='u':
        GPIO.output(in1,GPIO.HIGH)
        GPIO.output(in2,GPIO.HIGH)
        GPIO.output(in3,GPIO.HIGH)
        GPIO.output(in4,GPIO.LOW)
        sleep(usec)
        stop(0.3)

        
    elif x=='c':
        print("back left")
        GPIO.output(in1,GPIO.LOW)
        GPIO.output(in2,GPIO.LOW)
        GPIO.output(in3,GPIO.LOW)
        GPIO.output(in4,GPIO.HIGH)
        sleep(lsec)
        stop(0.3)
        #GPIO.cleanup()
        #left(3)
    elif x=='z':
        print("back right")
        #right(3)
        GPIO.output(in1,GPIO.HIGH)
        GPIO.output(in2,GPIO.LOW)
        GPIO.output(in3,GPIO.HIGH)
        GPIO.output(in4,GPIO.HIGH)
        sleep(rsec)
        stop(0.3)
        #GPIO.cleanup()
    elif x=='q':
        print("ending program...")
        GPIO.cleanup()
        break
    else:
        print("<<<  wrong data  >>>")
        print("please enter the defined data to continue.....")
        print("\n")
        print("--------------------------------------------------")
        print("Press: w-forward s-backward a-left d-right x-stop q-quit")
        print("--------------------------------------------------")
        print("\n") 
