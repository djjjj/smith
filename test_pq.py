# -*-encoding:utf8 -*-
import sys

from pyquery import PyQuery as pq
reload(sys)
sys.setdefaultencoding('utf8')

content = open('rl_zp0005_2/10.html').read()
content = unicode(content, 'utf8')

doc = pq(content)
result = {}

var_0 = doc("html")("body")("#main_box")(".corpInfo_box")(".CI_b_main")
for i, child_0 in enumerate(var_0.children()):
    child_0 = pq(child_0)
    if child_0.attr("class") == "corpName":
        var_2 = child_0(".corpName")
        for i, child_2 in enumerate(var_2.children()):
            child_2 = pq(child_2)
            if child_2.is_("h1"):
                result["name"] = child_2("h1").text()
            if child_2.is_("ul"):
                var_4 = child_2("ul")
                for i, child_4 in enumerate(var_4.children()):
                    child_4 = pq(child_4)
                    if child_4.is_("li"):
                        result["industryList"] = child_4("li").text()
                    if child_4.is_("li"):
                        result["address"] = child_4("li").text()
    if child_0.attr("class") == "CI_b_jobs":
        var_2 = child_0(".CI_b_jobs")("dl")("dd")("table")
        for i, child_2 in enumerate(var_2.children()):
            child_2 = pq(child_2)
            if child_2.is_("tr"):
                result["date"] = child_2("tr")(".bg_0").text()
            if child_2.is_("tr"):
                var_4 = child_2("tr")
                for i, child_4 in enumerate(var_4.children()):
                    child_4 = pq(child_4)
                    if child_4.attr("class") == "bg_1":
                        result["region"] = child_4(".bg_1").text()
                    if child_4.attr("class") == "bg_1":
                        result["salary"] = child_4(".bg_1").text()
            if child_2.is_("tr"):
                var_4 = child_2("tr")
                for i, child_4 in enumerate(var_4.children()):
                    child_4 = pq(child_4)
                    if child_4.attr("class") == "bg_0":
                        result["count"] = child_4(".bg_0").text()
                    if child_4.attr("class") == "bg_0":
                        result["education"] = child_4(".bg_0").text()
                    if child_4.attr("class") == "bg_0":
                        result["workyear"] = child_4(".bg_0").text()
            if child_2.is_("tr"):
                result["contact"] = child_2("tr")(".bg_0").text()

print result
