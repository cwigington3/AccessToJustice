# -*- coding: utf-8 -*-
"""
Created on Mon Mar  6 15:15:26 2017
@author: wigington
"""

in2 = open("LegalAidCounties.csv")
next = in2.readline()
next = in2.readline()
countiesDict = {}
while next != "":
    next = next.strip('\n')
    next = next.split(',')
    LegalAidOffice = next[0]
    Lawyers= next[1]
    CountiesServed = next[2]
    CountyName = next[3]
    organization = next[4]
    countiesDict[CountyName] = {}
    countiesDict[CountyName]['legalAidOffice'] = LegalAidOffice
    countiesDict[CountyName]['lawyers'] = float(Lawyers)
    countiesDict[CountyName]['countiesServed'] = float(CountiesServed)
    countiesDict[CountyName]['organization'] = organization
    next = in2.readline()
#counties = counties.sort()
in1 = open("us-states_lawyer_census.js")
#in2 = open("County_Lawyer_and_census_data.json")
County = in1.readline()
County = in1.readline()
out = open("Georgia_Data.js",'w')
out.write('''var statesData = {"type":"FeatureCollection","features":[\n''')
while County != " ]}\n":
    countyName = County[County.find("name")+7:County.find("Active")-3]
    #countiesDict[countyName]['organization']
    countyInfoMatchPrefix = County[0:County.find("Shorthand_FIPS")-1]
    countyInfoMatchSuffix = County[County.find("Shorthand_FIPS")-1:County.find("\n")+2]
    fullLine = countyInfoMatchPrefix + str(r'"'+"legalAidOffice"+r'"') + ": " + r'"'+countiesDict[countyName]['legalAidOffice'] + r'"' + ", " + str(r'"'+"lawyers"+r'"') + ": " + str(countiesDict[countyName]['lawyers']) + ", " + str(r'"'+"countiesServed" +r'"') + ": "  + str(countiesDict[countyName]['countiesServed']) +", " + str(r'"'+"Organization"+r'"') + ": " + r'"'+countiesDict[countyName]['organization']+r'"' + ", " + countyInfoMatchSuffix
    out.write(fullLine)
    County = in1.readline()
out.write(''']}''')
out.close()
in1.close()
in2.close()
