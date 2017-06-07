# -*- coding: utf-8 -*-
"""
Created on Mon Mar  6 15:15:26 2017
@author: wigington
"""

in1 = open("us-states_lawyer_census.js")
in2 = open("County_Lawyer_and_census_data.json")
next = in2.readline()
next = in2.readline()
counties = dict()
while next != "":
    next = next.strip('\n')
    countyName = next[next.find("COUNTY")+10:next.find(", \"OBJECTID")-1]
    countyInfo = next[next.find("Active")-1:next.find("},")-2] +	","
    counties[countyName] = countyInfo
    next = in2.readline()
#counties = counties.sort()
countyShapes = in1.readline()
countyShapes = in1.readline()
out = open("Georgia_Data.js",'w')
while countyShapes != " ]}\n":
    countyNameMatch = countyShapes[countyShapes.find("name")+7:countyShapes.find("LSAD")-3]
    countyInfoMatchPrefix = countyShapes[0:countyShapes.find("LSAD")-1]
    countyInfoMatchSuffix = countyShapes[countyShapes.find("LSAD")-1:countyShapes.find("\n")+2]
    fullLine = countyInfoMatchPrefix + counties[countyNameMatch] + countyInfoMatchSuffix
    out.write(fullLine)
    countyShapes = in1.readline()
out.close()
