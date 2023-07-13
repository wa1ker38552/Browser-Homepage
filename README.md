# Browser-Homepage v2.0
A minimalistic custom homepage for myself. Includes shortcuts, bookmarks, custom backgrouns, and search engine choosing.

**Shortcuts** <br>
**/** ~ Selects the search bar <br>
**esc** ~ Clears the search bar and unselects it <br>
**g | G** ~ Sets the search engine to Google <br>
**b | B** ~ Sets the search engine to Bing <br>
**d | D** ~ Sets the search engine to DuckDuckGo <br>
**r | R** ~ Sets the search engine to Brave <br>
**enter** ~ Searches using the selected engine for {keyword} <br>
**shift+enter** ~ Directly puts the {keyword} into the search bar. (If it doesn't contain https:// it will add it for you) <br>
**ctrl+x** ~ Toggles settings modal <br>

Links are in JSON in the following format:
```json
{
  "YOUR_SECTION_NAME": [
    {"href": "YOUR_URL_HERE", "title": "YOUR_URL_TITLE_HERE"}
  ]
}
```
If you put in invalid JSON, it will revert to your last saved changes. All links data and background data is stored in cookies. If you data mysteriously resets its because you cleared all cookies or the date is past [2038](https://en.wikipedia.org/wiki/Year_2038_problem)

![image](https://user-images.githubusercontent.com/100868154/235366890-ff73ccb6-28a6-4768-954a-f54514ca11c5.png)
