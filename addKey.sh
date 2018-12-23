#!/bin/bash
read -p "What is the new language key? " langKey
while [[ "$langKey" =~ [^A-Z_] ]]; do
	echo "Invalid key! Must be all uppercase, with only underscores like this: EXAMPLE_KEY"
	read -p "What is the new language key? " langKey
done
read -r -p "What is the new language statement? " langMsg
langMsg=$(sed 's|"|\\"|g' <<< $langMsg)
NEWLINE=$'\n'
for filename in *.json; do
    jsonContent=`sed 'N;s/}$//g' $filename`
    if [[ "$jsonContent" == *"\"$langKey\""* ]]; then
    	echo "That key exists already!";
    	exit 1;
	fi
    if [[ "$jsonContent" == *"\"$langMsg\""* ]]; then
    	echo "That message exists already!";
    	exit 1;
	fi
	jsonContent=$(echo "$jsonContent" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
	jsonContent+=",${NEWLINE}"
	jsonContent+="  \"${langKey}\" : \"${langMsg}\""
	jsonContent+="${NEWLINE}"
	jsonContent+="}"
	echo "$jsonContent" > "$filename"
done
echo "Done."
