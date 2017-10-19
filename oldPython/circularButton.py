from kivy.uix.behaviors.button import ButtonBehavior
from kivy.uix.widget import Widget
from kivy.lang import Builder
from kivy.vector import Vector


root = Builder.load_file("./circularbutton.kv")


class CircularButton(ButtonBehavior, Widget):

    def collide_point(self, x, y):
        return Vector(x, y).distance(self.center) <= self.width / 2


if __name__ == '__main__':
    from kivy.base import runTouchApp

    def callback(*args):
        print("i'm being pressed")

    runTouchApp(CircularButton(on_press=callback))
