# -*- coding: utf-8 -*-
"""
Created on Mon Mar  6 15:15:26 2017

@author: wigington
"""

# f = open("/home/wigington/Dropbox (Weitz Group)/AtJ_working_folder/Georgia_Counties_Centroids.csv")
# next = f.readline()
# next = f.readline()
# while next != "":
#     countyLatLong = next.split(",")
#     #print(str("""{"loc":[""" + countyLatLong[1] + "," + countyLatLong[2].rstrip('\n') + """], "title":""" + countyLatLong[0] + '''},'''))
#     print(str("""{"type": "Feature","properties": {"STATION":""" + countyLatLong[0] + """, "ST_CODE": """ + countyLatLong[0] + """,},"geometry":{"type": "Point", "coordinates": [""" + countyLatLong[2].rstrip('\n') + "," + countyLatLong[1] + """]}},"""))
#     next = f.readline()



f = open("/home/wigington/Dropbox (Weitz Group)/AtJ_working_folder/Georgia_Counties_Centroids.csv")
next = f.readline()
next = f.readline()
counties = []
countylong = []
countylat = []
while next != "":
    countyLatLong = next.strip('\n')
    countyLatLong = countyLatLong.split(",")
    counties.append(countyLatLong[0])
    countylat.append(countyLatLong[2])
    countylong.append(countyLatLong[1])
    next = f.readline()
#counties = counties.sort()
for county in sorted(counties):
	position = counties.index(county)
	print(str("""{"type": "Feature","properties": {"STATION":""" + counties[position] + """, "ST_CODE": """ + counties[position] + """,},"geometry":{"type": "Point", "coordinates": [""" + countylat[position] + "," + countylong[position] + """]}},"""))
	





