
from classes import Point
from vector import Vector
from math import acos


def _load_file(file_name):
    points = []
    f = open(file_name)
    line = f.readline()
    line = line.strip()
    raw_points = line.split(',')
    for raw_point in raw_points:
        raw_data = raw_point.split(' ')
        point = Point(float(raw_data[0]), float(raw_data[1]))
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
        sequence.append(length)
        v1n = vectors[i].normalize()
        v2n = vectors[i + 1].normalize()
        angle = acos(v1n * v2n)
        sequence.append(angle)
        i += 1
    length = vectors[i].norm()

    return sequence


def generate_sequence():
    points = _load_file("Christchurch_Akaroa_RD_line_string.txt")
    vectors = _create_vectors(points)
    sequence = _build_sequence(vectors)
    return sequence


if __name__ == "__main__":
    import doctest
    doctest.testmod()
