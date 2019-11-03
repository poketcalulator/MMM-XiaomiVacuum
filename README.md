# MMM-XiaomiVacuum
This an module for the [MagicMirror](https://github.com/MichMich/MagicMirror) 2 by MichMich

My module can display various status information from the Xiaomi robot vacuum cleaner.

### Example
![image](https://github.com/poketcalulator/MMM-XiaomiVacuum/blob/master/image/MMM-XiaomiVacuum.png)

## Installation
1. Open a terminal session, navigate to your MagicMirror's `modules` folder and execute
`git clone https://github.com/poketcalulator/MMM-XiaomiVacuum`

2. A new folder called MMM-XiaomiVacuum will be created, navigate into it.

3. Execute: npm install


## Using the module
````javascript
modules: [
  {
      module: 'MMM-XiaomiVacuum',
      position: 'top_right',
      header: 'Xiaomi Vacuum', // Optional
      config: {
          token: 'YOUR XIAOMI VACUUM TOKEN',
          ipAddress: 'YOUR XIAOMI VACUUM IP ADDRESS'
      }
  },    
````

## Config Options

|Option|Default|Description|
|:---|:---:|:---|
|`token`|REQUIRED|Enter your Xiaomi Vacuum API token here (see below how it can be done)|
|`ipAddress`|REQUIRED|Enter your Xiaomi Vacuum IP address here|


## Obtain Mi Home device token
The best guide I have been able to find
[Obtain Mi Home device token](https://github.com/jghaanstra/com.xiaomi-miio/blob/master/docs/obtain_token.md)


## Credits
- To [Michael Teeuw](https://magicmirror.builders)
- To Andreas Holstenson / aholstenson [miIO Device Library](https://github.com/aholstenson/miio) without it it would not be possible (for me (ツ) )
- To Reagan Elm / relm923which [MMM-Roomba](https://github.com/relm923/MMM-Roomba) on which my module is based.
