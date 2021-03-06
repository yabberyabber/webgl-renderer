import fileinput
import json

points = []
indices = []
normals = []

for line in fileinput.input():
    line = line.split(' ')
    if line[0] == 'v':
        points.append({
            'x': float(line[1]),
            'y': float(line[2]),
            'z': float(line[3])})
    elif line[0] == 'vn':
        normals.append({
            'x': float(line[1]),
            'y': float(line[2]),
            'z': float(line[3])})
    elif line[0] == 'f':
        indices.append([
            int(line[1].split('/')[0]) - 1,
            int(line[2].split('/')[0]) - 1,
            int(line[3].split('/')[0]) - 1])
        for point_normal in line[1:]:
            point_normal = point_normal.split('/')
            points[int(point_normal[0]) - 1]['normal'] = normals[int(point_normal[2]) - 1]

outpt = {
        "points": points,
        "indices": indices,
        "type": "primative"
        }
print(json.dumps(outpt))
