import fileinput
import json

points = []
indices = []

for line in fileinput.input():
    line = line.split(' ')
    if line[0] == 'v':
        points.append({'x': line[1], 'y': line[2], 'z': line[3]})
    elif line[0] == 'f':
        indices.append([
            line[1].split('/')[0],
            line[1].split('/')[1],
            line[1].split('/')[2]])

outpt = {"points": points, "indices": indices}

