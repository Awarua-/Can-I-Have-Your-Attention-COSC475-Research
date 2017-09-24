from kivy.app import App
from kivy.uix.label import Label
from kivy.core.window import Window


class DrivingApp(App):

    def build(self):
        Window.fullscreen = False
        # Need to set the size, otherwise very pixalated, wonders about pixel mapping?
        Window.size(1920, 1080)
        b = Label(text='Launch Child App')
        return b


if __name__ == "__main__":
    DrivingApp.run()
