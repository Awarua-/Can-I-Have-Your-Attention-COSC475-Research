from kivy.app import App
from kivy.uix.label import Label


class TouchScreenApp(App):
    def build(self):
        return Label(text='Child')


if __name__ == '__main__':
    TouchScreenApp().run()
