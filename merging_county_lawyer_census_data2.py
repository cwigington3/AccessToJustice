# -*- coding: utf-8 -*-
"""
Created on Tue Jun 20 13:25:20 2017

@author: charl
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Mar  6 15:15:26 2017
@author: wigington
"""

in2 = open("GA_Counties/ga_counties.json")
next = in2.readline()
next = in2.readline()
countiesDict = {}
while next != "":
    next = next.strip('\n')
    next = next.strip('\t')
	coordinatesline = next
    next = next.split(',')
    CountyName = next[2]
    CountyName = CountyName.split(':')[1]
    CountyName = CountyName.strip(' ')    
    CountyName = CountyName.strip('"')
    coordinates = coordinatesline[coordinatesline.find("coordinates")-1:] 
	countiesDict[CountyName] = coordinates
    next = in2.readline()
#counties = counties.sort()
in1 = open("us-states.js")
#in2 = open("County_Lawyer_and_census_data.json")
County = in1.readline()
County = in1.readline()
out = open("lowres_Georgia_Counties.js",'w')
out.write('''var statesData = {"type":"FeatureCollection","features":[\n''')
while County != " ]}\n":
    countyName = County[County.find("name")+7:County.find("Active")-3]
    #countiesDict[countyName]['organization']
    countyInfoMatchPrefix = County[0:County.find("coordinates")-1]
    #countyInfoMatchSuffix = County[County.find("Shorthand_FIPS")-1:County.find("\n")+2]
    fullLine = countyInfoMatchPrefix + countiesDict[countyName] + '\n'
    out.write(fullLine)
    County = in1.readline()
out.write(''']}''')
out.close()
in1.close()
in2.close()
