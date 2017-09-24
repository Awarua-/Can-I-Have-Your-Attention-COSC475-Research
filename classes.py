from mpmath import mp


mp.dps = 100


class Point:

    def __init__(self, x, y):
        self.x = mp.mpf(x)
        self.y = mp.mpf(y)

    def __repr__(self):
        return "Point({!r}, {!r})".format(self.x, self.y)


class LengthAnglePair:

    def __init__(self, length, angle):
        self.length = length
        self.angle = angle

    def __repr__(self):
        return "LengthAnglePair({!r}, {!r})".format(self.length, self.angle)
