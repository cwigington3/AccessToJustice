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

in2 = open("County_Lawyer_and_census_data.json")
next = in2.readline()
countiesDict = {}
while next != "":
    next = next.strip('\n')
    next = next.split(',')
    totalPop = next[26]
    CountyName = next[0]
    CountyName = CountyName.split(':')[1]
    CountyName = CountyName.strip(' ')    
    CountyName = CountyName.strip('"')
    countiesDict[CountyName] = totalPop
    next = in2.readline()
#counties = counties.sort()
in1 = open("Georgia_Data.js")
#in2 = open("County_Lawyer_and_census_data.json")
County = in1.readline()
County = in1.readline()
out = open("Georgia_Data_1.js",'w')
out.write('''var statesData = {"type":"FeatureCollection","features":[\n''')
while County != " ]}\n":
    countyName = County[County.find("name")+7:County.find("Active")-3]
    #countiesDict[countyName]['organization']
    countyInfoMatchPrefix = County[0:County.find("Shorthand_FIPS")-1]
    countyInfoMatchSuffix = County[County.find("Shorthand_FIPS")-1:County.find("\n")+2]
    fullLine = countyInfoMatchPrefix + str(countiesDict[countyName]) +", " + countyInfoMatchSuffix
    out.write(fullLine)
    County = in1.readline()
out.write(''']}''')
out.close()
in1.close()
in2.close()
