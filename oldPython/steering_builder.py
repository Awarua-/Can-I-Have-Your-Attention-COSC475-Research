
from classes import Point, LengthAnglePair, LengthAnglePairEncoder
from vector import Vector
from mpmath import mp, atan2, degrees
from json import dump


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
    current_angle = 0
    while i < len(vectors) - 1:
        length = vectors[i].norm()
        v1n = vectors[i]
        v2n = vectors[i + 1]
        cross_prod = Vector(v1n[0] * v2n[1] - v1n[1] * v2n[0],
                            v1n[0] * v2n[0] + v1n[1] * v2n[1])
        angle = degrees(atan2(cross_prod[0], cross_prod[1]))
        abs_angle = current_angle + angle
        sequence.append(LengthAnglePair(length, abs_angle))
        i += 1
    #length = vectors[i].norm()
    #sequence.append(LengthAnglePair(length, None))

    return sequence


def generate_sequence():
    points = _load_file("Christchurch_Akaroa_RD_line_string.txt")
    vectors = _create_vectors(points)
    sequence = _build_sequence(vectors)
    return sequence


def normalise_squence(sequence):
    angle = 0
    min_angle = angle
    max_angle = angle
    length_total = 0
    threshold = 0.05
    isForward = False
    sanitized_squence = [LengthAnglePair(0, 0)]

    for length_and_angle in sequence:
        length_total += length_and_angle.length
        if length_and_angle.angle is not None:
            angle += length_and_angle.angle
            if angle < min_angle:
                min_angle = angle
            if angle > max_angle:
                max_angle = angle

    delta_angle = max_angle - min_angle
    for LA in sequence:
        LA.angle = (LA.angle - min_angle) / delta_angle
        difference = LA.angle - sanitized_squence[-1].angle
        abs_diff = abs(difference)
        if abs_diff > threshold:
            if difference < 0 and isForward:
                # change of direction from forward to reverse
                isForward = False
                sanitized_squence.append(LA)
            elif difference > 0 and not isForward:
                # change of direction from reverse to forward
                isForward = True
                sanitized_squence.append(LA)


    return sanitized_squence


if __name__ == "__main__":
    import doctest
    doctest.testmod()
    sequence = generate_sequence()
    sanitized_squence = normalise_squence(sequence)
    with open('sequence.json', 'w') as fp:
        dump(sanitized_squence, fp, cls=LengthAnglePairEncoder)
