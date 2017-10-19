from tkinter import *
import random

class ScrollCanvas(object):

    def __init__(self, master):
        self.master = master
        self.width = 500
        self.height = 500
        self.yscroll = 1.0
        self.arrow_delta = 5
        self.f = f = Frame(master, width=self.width, height=self.height)
        f.pack(side='top')
        self.c = c = Canvas(f, width=self.width, height=self.height, scrollregion=(0,0,500, 100000)) 
        c.pack(side='top')
        points = [(round(random.random() * self.width), x) for x in range(0, 100001, 500)]
        c.create_line(points,  smooth=True)
        c.yview_moveto(1.0)
        
        self.arrow_loc = 245
        self.bc = bc = Canvas(f, width=self.width, height=30)
        bc.pack(side='bottom')
        bc.create_line(self.arrow_loc, 30, self.arrow_loc, 5, width=10, tag='arrow', fill='red', arrow='last')

        self.master.bind('<Left>', self.left_key)
        self.master.bind('<Right>', self.right_key)
        
        

    def advance (self):
        self.yscroll -= 0.0005            # DECREASE THIS VALUE for slower scrolling
        self.c.yview_moveto(self.yscroll)
        self.master.update_idletasks()
        self.master.after(50, self.advance) 

    def left_key(self, event):
        if self.arrow_loc > self.arrow_delta:
            self.arrow_loc -= self.arrow_delta
        self.redraw_arrow()
  
    def right_key(self, event):
        if self.arrow_loc < self.width -  self.arrow_delta:
            self.arrow_loc += self.arrow_delta
        self.redraw_arrow()
  
    def redraw_arrow(self):
        self.bc.coords('arrow', self.arrow_loc, 30, self.arrow_loc, 5)

        
master = Tk()
s = ScrollCanvas(master)
s.advance()
 

mainloop()
