from steering_builder import generate_sequence

from touch_screen_app import TouchScreenApp
from driving_app import DrivingApp

import multiprocessing


def main():
    sequence = generate_sequence()

    angle = 0
    min_angle = angle
    max_angle = angle
    length_total = 0

    for length_and_angle in sequence:
        length_total += length_and_angle.length
        if length_and_angle.angle is not None:
            angle += length_and_angle.angle
            if angle < min_angle:
                min_angle = angle
            if angle > max_angle:
                max_angle = angle

    print("Length: {}".format(length_total))
    print("Min Angle: {}".format(min_angle))
    print("Max Angle: {}".format(max_angle))


def open_driving_app():
    DrivingApp().run()


def open_touch_screen_app():
    TouchScreenApp().run()


if __name__ == "__main__":
    driving_app = multiprocessing.Process(target=open_driving_app)
    touch_screen_app = multiprocessing.Process(target=open_touch_screen_app)
    driving_app.start()
    touch_screen_app.start()
