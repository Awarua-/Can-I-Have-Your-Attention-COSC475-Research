from kivy.app import App
from kivy.core.window import Window


# Window.fullscreen = 'auto'
Window.allow_screensaver = False
# Window.borderless = True


class TouchScreenApp(App):
    pass


if __name__ == '__main__':
    TouchScreenApp().run()
