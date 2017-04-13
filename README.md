# s3-assets-migrations

### JSON with results: http://fnnzzz.xyz/_files/result.json

## Manual
1. ``` cd ./img2 ```
2. Find all files from all dir and subdir 
``` dir /b /a-d /s > all_files.txt ```
3. Find all css and JS
``` dir /b /a-d /s | grep -i \.css$ > all_css.txt ```
``` dir /b /a-d /s | grep -i \.js$ > all_js.txt ```
4. copy all 'txt' files to dir `result`
5. run ``` node index.js ``` in root dir
