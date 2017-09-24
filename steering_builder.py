
from classes import Point, LengthAnglePair
from vector import Vector
from mpmath import mp, atan2, degrees


mp.dps = 100


def _load_file(file_name):
    points = []
    f = open(file_name)
    line = f.readline()
    line = line.strip()
    raw_points = line.split(',')
    for raw_point in raw_points:
        raw_data = raw_point.split(' ')
        point = Point(raw_data[0], raw_data[1])
        points.append(point)
    return points


def _create_vectors(points):
    vectors = []
    i = 0
    while i < len(points) - 1:
        vector = Vector(points[i].x - points[i + 1].x,
                        points[i].y - points[i + 1].y)
        vectors.append(vector)
        i += 1
    return vectors


def _build_sequence(vectors):
    sequence = []
    i = 0
    while i < len(vectors) - 1:
        length = vectors[i].norm()
        v1n = vectors[i]
        v2n = vectors[i + 1]
        cross_prod = Vector(v1n[0] * v2n[1] - v1n[1] * v2n[0],
                            v1n[0] * v2n[0] + v1n[1] * v2n[1])
        angle = degrees(atan2(cross_prod[0], cross_prod[1]))
        sequence.append(LengthAnglePair(length, angle))
        i += 1
    length = vectors[i].norm()
    sequence.append(LengthAnglePair(length, None))

    return sequence


def generate_sequence():
    points = _load_file("Christchurch_Akaroa_RD_line_string.txt")
    vectors = _create_vectors(points)
    sequence = _build_sequence(vectors)
    return sequence


if __name__ == "__main__":
    import doctest
    doctest.testmod()
