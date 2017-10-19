from mpmath import mp
import json

mp.dps = 100


class Point(object):

    def __init__(self, x, y):
        self.x = mp.mpf(x)
        self.y = mp.mpf(y)

    def __repr__(self):
        return "Point({!r}, {!r})".format(self.x, self.y)


class LengthAnglePair(object):

    def __init__(self, length, angle):
        self.length = length
        self.angle = angle

    def __repr__(self):
        return "LengthAnglePair({!r}, {!r})".format(self.length, self.angle)


class LengthAnglePairEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, LengthAnglePair):
            return {"length": str(obj.length), "angle": str(obj.angle)}
        return json.JSONEncoder.default(self, obj)
