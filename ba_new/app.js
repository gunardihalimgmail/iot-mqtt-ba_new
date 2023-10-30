const mqtt = require('mqtt')
const moment = require('moment');
const { Op } = require("sequelize");
const Device = require('./models/device');
const Message = require('./models/message');
const host = '192.168.1.120'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
var i=0;


const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'admin',
  password: 'public',
  reconnectPeriod: 1000,
});



const topic = 'ba/#'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
  /*client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })*/
});
client.on('message', async (topic, payload) => {
  console.log(topic);
  
  var js= JSON.parse(payload.toString());
  
  var tm = moment.unix(js.time);
  var dateString = moment(tm).format("YYYY-MM-DD HH:mm");
  dateString= dateString+":00.0000000";
  console.log (dateString);
  var str = topic.replace("ba/", "");
  var idDevice=str;
  if (idDevice=="temperatureTASK1")
  {
      try{
     
        var tank1='TASK1TANK5';
        var tank2='TASK1TANK6';
        var tank3='TASK1TANK7';
        var temperatureTASK1TANK1_02= js.sensorDatas[2].value;
        var temperatureTASK1TANK1_2= js.sensorDatas[3].value;
        var temperatureTASK1TANK1_6= js.sensorDatas[4].value;
        var temperatureTASK1TANK1_9= js.sensorDatas[5].value;
        var temperatureTASK1TANK1_12= js.sensorDatas[6].value;
        var temperatureTASK1TANK2_02= js.sensorDatas[7].value;
        var temperatureTASK1TANK2_2= js.sensorDatas[8].value;
        var temperatureTASK1TANK2_6= js.sensorDatas[9].value;
        var temperatureTASK1TANK2_9= js.sensorDatas[10].value;
        var temperatureTASK1TANK2_12= js.sensorDatas[11].value;
        var temperatureTASK1TANK3_02= js.sensorDatas[12].value;
        var temperatureTASK1TANK3_2= js.sensorDatas[13].value;
        var temperatureTASK1TANK3_6= js.sensorDatas[14].value;
        var temperatureTASK1TANK3_9= js.sensorDatas[15].value;
        var temperatureTASK1TANK3_12= js.sensorDatas[16].value;
        var checkDevs= await checkDevice(tank1);
        var  checkDevs2= await checkDevice(tank2);
        var  checkDevs3= await checkDevice(tank3);
        if (checkDevs2.length<1)
        {
          createDevice(tank2);
        }
        if (checkDevs3.length<1)
        {
          createDevice(tank3);
        }
        if (checkDevs.length<1)
        {
          createDevice(tank1);
        }
        const cekdata= await Message.findAll({
          where :{id_device:tank1,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });
        const cekdata2= await Message.findAll({
          where :{id_device:tank2,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });

        const cekdata3= await Message.findAll({
          where :{id_device:tank3,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });
        console.log(cekdata.length);
        if(cekdata.length<1)
        {
          var dataTANK1={
            Tank5TASK1_0_2:temperatureTASK1TANK1_02,
            Tank5TASK1_2:temperatureTASK1TANK1_2,
            Tank5TASK1_6:temperatureTASK1TANK1_6,
            Tank5TASK1_9:temperatureTASK1TANK1_9,
            Tank5TASK1_12:temperatureTASK1TANK1_12,
          }
          const inserTANK1= insertMessage(tank1,dateString,dataTANK1);
        }
        if(cekdata2.length<1)
        {
          var dataTANK2={
            Tank6TASK1_0_2:temperatureTASK1TANK2_02,
            Tank6TASK1_2:temperatureTASK1TANK2_2,
            Tank6TASK1_6:temperatureTASK1TANK2_6,
            Tank6TASK1_9:temperatureTASK1TANK2_9,
            Tank6TASK1_12:temperatureTASK1TANK2_12,
          }
          const inserTANK2= insertMessage(tank2,dateString,dataTANK2);
        }

        if(cekdata3.length<1)
        {
          var dataTANK3={
            Tank7TASK1_0_2:temperatureTASK1TANK3_02,
            Tank7TASK1_2:temperatureTASK1TANK3_2,
            Tank7TASK1_6:temperatureTASK1TANK3_6,
            Tank7TASK1_9:temperatureTASK1TANK3_9,
            Tank7TASK1_12:temperatureTASK1TANK3_12,

          }
          const inserTANK3= insertMessage(tank3,dateString,dataTANK3);
        }
        if(cekdata.length>0)
        {
          var data5= cekdata[0].data;
          var idTank5=cekdata[0].id;
          var tmpdata= JSON.parse(data5);
          if (!tmpdata.hasOwnProperty("Tank5TASK1_0_2")) {
         
            tmpdata.Tank5TASK1_0_2=temperatureTASK1TANK1_02;
            tmpdata.Tank5TASK1_2=temperatureTASK1TANK1_2;
            tmpdata.Tank5TASK1_6=temperatureTASK1TANK1_6;
            tmpdata.Tank5TASK1_9=temperatureTASK1TANK1_9;
            tmpdata.Tank5TASK1_12=temperatureTASK1TANK1_12;
            updateMessage(idTank5,tmpdata);
          }
        }

        if(cekdata2.length>0)
        {
          var data6= cekdata2[0].data;
          var idTank6=cekdata2[0].id;
          var tmpdata2= JSON.parse(data6);
          if (!tmpdata2.hasOwnProperty("Tank6TASK1_0_2")) {
         
            tmpdata2.Tank6TASK1_0_2=temperatureTASK1TANK2_02;
            tmpdata2.Tank6TASK1_2=temperatureTASK1TANK2_2;
            tmpdata2.Tank6TASK1_6=temperatureTASK1TANK2_6;
            tmpdata2.Tank6TASK1_9=temperatureTASK1TANK2_9;
            tmpdata2.Tank6TASK1_12=temperatureTASK1TANK2_12;
            updateMessage(idTank6,tmpdata2);
          }
        }

        if(cekdata3.length>0)
        {
          var data7= cekdata3[0].data;
          var idTank7=cekdata3[0].id;
          var tmpdata3= JSON.parse(data7);
          if (!tmpdata3.hasOwnProperty("Tank7TASK1_0_2")) {
            tmpdata3.Tank7TASK1_0_2=temperatureTASK1TANK3_02,
            tmpdata3.Tank7TASK1_2=temperatureTASK1TANK3_2;
            tmpdata3.Tank7TASK1_6=temperatureTASK1TANK3_6;
            tmpdata3.Tank7TASK1_9=temperatureTASK1TANK3_9;
            tmpdata3.Tank7TASK1_12=temperatureTASK1TANK3_12;
            updateMessage(idTank7,tmpdata3);
          }
        }
      
      }

      catch(err)
    {
        
       console.log(err);
        
    }
  
    
  }
  if (idDevice=="radarTASK1")
  {
      try{
		
			console.log('Received Message:', topic, payload.toString());
			var tank1='TASK1TANK5';
			var tank2='TASK1TANK6';
			var tank3='TASK1TANK7';
			var radarTANK1= js.sensorDatas[2].value;
			var radarTANK2= js.sensorDatas[4].value;
			var radarTANK3= js.sensorDatas[6].value;

			const cekdata= await Message.findAll({
			  where :{id_device:tank1,time:dateString},
			  limit:1,
			  order:[['time','DESC']]
			});
			console.log("RADAR 5"+cekdata.length);

			const cekdata2= await Message.findAll({
			  where :{id_device:tank2,time:dateString},
			  limit:1,
			  order:[['time','DESC']]
			});

			const cekdata3= await Message.findAll({
			  where :{id_device:tank3,time:dateString},
			  limit:1,
			  order:[['time','DESC']]
			});
			console.log('HASIL RADAR 5 :'+cekdata.length);
			if (cekdata.length<1)
			{
			   var dataTank1={
					distanceTank5:radarTANK1
			   }
			   const inserTANK= insertMessage(tank1,dateString,dataTank1);
			}

			if (cekdata2.length<1)
			{
			   var dataTank2={
				distanceTank6:radarTANK2
			   }
			   const inserTANK2= insertMessage(tank2,dateString,dataTank2);
			}

			if (cekdata3.length<1)
			{
			   var dataTank3={
				distanceTank7:radarTANK3
			   }
			   
			   const inserTANK3= insertMessage(tank3,dateString,dataTank3);
			}

			if (cekdata.length>0)
			{
			  var data5= cekdata[0].data;
			  var idTank5=cekdata[0].id;
			  var tmpdata= JSON.parse(data5);
			  if (!tmpdata.hasOwnProperty("distanceTank5")) {
				tmpdata.distanceTank5=radarTANK1;
				updateMessage(idTank5,tmpdata);
			  }
			}

			if (cekdata2.length>0)
			{
			  var data6= cekdata2[0].data;
			  var idTank6=cekdata2[0].id;
			  var tmpdata2= JSON.parse(data6);
			  if (!tmpdata2.hasOwnProperty("distanceTank6")) {
				tmpdata2.distanceTank6=radarTANK2;
				updateMessage(idTank6,tmpdata2);
			  }
			}

			if (cekdata3.length>0)
			{
			  var data7= cekdata3[0].data;
			  var idTank7=cekdata3[0].id;
			  var tmpdata3= JSON.parse(data7);
			  if (!tmpdata3.hasOwnProperty("distanceTank7")) {
				tmpdata3.distanceTank7=radarTANK3;
				updateMessage(idTank7,tmpdata3);
			  }
			}


        }
      catch(err)
    {
        
       console.log(err);
    }
  }
  if (idDevice=="temperatureTASK1")
  {
      try{
      
        var tank1='TASK1TANK5';
        var tank2='TASK1TANK6';
        var tank3='TASK1TANK7';
        var temperatureTASK1TANK1_02= js.sensorDatas[2].value;
        var temperatureTASK1TANK1_2= js.sensorDatas[3].value;
        var temperatureTASK1TANK1_6= js.sensorDatas[4].value;
        var temperatureTASK1TANK1_9= js.sensorDatas[5].value;
        var temperatureTASK1TANK1_12= js.sensorDatas[6].value;
        var temperatureTASK1TANK2_02= js.sensorDatas[7].value;
        var temperatureTASK1TANK2_2= js.sensorDatas[8].value;
        var temperatureTASK1TANK2_6= js.sensorDatas[9].value;
        var temperatureTASK1TANK2_9= js.sensorDatas[10].value;
        var temperatureTASK1TANK2_12= js.sensorDatas[11].value;
        var temperatureTASK1TANK3_02= js.sensorDatas[12].value;
        var temperatureTASK1TANK3_2= js.sensorDatas[13].value;
        var temperatureTASK1TANK3_6= js.sensorDatas[14].value;
        var temperatureTASK1TANK3_9= js.sensorDatas[15].value;
        var temperatureTASK1TANK3_12= js.sensorDatas[16].value;
        var checkDevs= await checkDevice(tank1);
        var  checkDevs2= await checkDevice(tank2);
        var  checkDevs3= await checkDevice(tank3);
        if (checkDevs2.length<1)
        {
          createDevice(tank2);
        }
        if (checkDevs3.length<1)
        {
          createDevice(tank3);
        }
        if (checkDevs.length<1)
        {
          createDevice(tank1);
        }
        const cekdata= await Message.findAll({
          where :{id_device:tank1,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });
        const cekdata2= await Message.findAll({
          where :{id_device:tank2,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });

        const cekdata3= await Message.findAll({
          where :{id_device:tank3,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });
        console.log(cekdata.length);
        if(cekdata.length<1)
        {
          var dataTANK1={
            Tank5TASK1_0_2:temperatureTASK1TANK1_02,
            Tank5TASK1_2:temperatureTASK1TANK1_2,
            Tank5TASK1_6:temperatureTASK1TANK1_6,
            Tank5TASK1_9:temperatureTASK1TANK1_9,
            Tank5TASK1_12:temperatureTASK1TANK1_12,
          }
          const inserTANK1= insertMessage(tank1,dateString,dataTANK1);
        }
        if(cekdata2.length<1)
        {
          var dataTANK2={
            Tank6TASK1_0_2:temperatureTASK1TANK2_02,
            Tank6TASK1_2:temperatureTASK1TANK2_2,
            Tank6TASK1_6:temperatureTASK1TANK2_6,
            Tank6TASK1_9:temperatureTASK1TANK2_9,
            Tank6TASK1_12:temperatureTASK1TANK2_12,
          }
          const inserTANK2= insertMessage(tank2,dateString,dataTANK2);
        }

        if(cekdata3.length<1)
        {
          var dataTANK3={
            Tank7TASK1_0_2:temperatureTASK1TANK3_02,
            Tank7TASK1_2:temperatureTASK1TANK3_2,
            Tank7TASK1_6:temperatureTASK1TANK3_6,
            Tank7TASK1_9:temperatureTASK1TANK3_9,
            Tank7TASK1_12:temperatureTASK1TANK3_12,

          }
          const inserTANK3= insertMessage(tank3,dateString,dataTANK3);
        }
        if(cekdata.length>0)
        {
          var data5= cekdata[0].data;
          var idTank5=cekdata[0].id;
          var tmpdata= JSON.parse(data5);
          if (!tmpdata.hasOwnProperty("Tank5TASK1_0_2")) {
         
            tmpdata.Tank5TASK1_0_2=temperatureTASK1TANK1_02;
            tmpdata.Tank5TASK1_2=temperatureTASK1TANK1_2;
            tmpdata.Tank5TASK1_6=temperatureTASK1TANK1_6;
            tmpdata.Tank5TASK1_9=temperatureTASK1TANK1_9;
            tmpdata.Tank5TASK1_12=temperatureTASK1TANK1_12;
            updateMessage(idTank5,tmpdata);
          }
        }

        if(cekdata2.length>0)
        {
          var data6= cekdata2[0].data;
          var idTank6=cekdata2[0].id;
          var tmpdata2= JSON.parse(data6);
          if (!tmpdata2.hasOwnProperty("Tank6TASK1_0_2")) {
         
            tmpdata2.Tank6TASK1_0_2=temperatureTASK1TANK2_02;
            tmpdata2.Tank6TASK1_2=temperatureTASK1TANK2_2;
            tmpdata2.Tank6TASK1_6=temperatureTASK1TANK2_6;
            tmpdata2.Tank6TASK1_9=temperatureTASK1TANK2_9;
            tmpdata2.Tank6TASK1_12=temperatureTASK1TANK2_12;
            updateMessage(idTank6,tmpdata2);
          }
        }

        if(cekdata3.length>0)
        {
          var data7= cekdata3[0].data;
          var idTank7=cekdata3[0].id;
          var tmpdata3= JSON.parse(data7);
          if (!tmpdata3.hasOwnProperty("Tank7TASK1_0_2")) {
            tmpdata3.Tank7TASK1_0_2=temperatureTASK1TANK3_02,
            tmpdata3.Tank7TASK1_2=temperatureTASK1TANK3_2;
            tmpdata3.Tank7TASK1_6=temperatureTASK1TANK3_6;
            tmpdata3.Tank7TASK1_9=temperatureTASK1TANK3_9;
            tmpdata3.Tank7TASK1_12=temperatureTASK1TANK3_12;
            updateMessage(idTank7,tmpdata3);
          }
        }
      
      }

      catch(err)
    {
        
       console.log(err);
        
    }
  
    
  }
  if (idDevice=="radarTASK1")
  {
      try{
        var tank1='TASK1TANK5';
        var tank2='TASK1TANK6';
        var tank3='TASK1TANK7';
        var radarTANK1= js.sensorDatas[2].value;
        var radarTANK2= js.sensorDatas[4].value;
        var radarTANK3= js.sensorDatas[6].value;

        const cekdata= await Message.findAll({
          where :{id_device:tank1,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });

        const cekdata2= await Message.findAll({
          where :{id_device:tank2,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });

        const cekdata3= await Message.findAll({
          where :{id_device:tank3,time:dateString},
          limit:1,
          order:[['id','DESC']]
        });
        console.log(cekdata.length);
        if (cekdata.length<1)
        {
           var dataTank1={
            distanceTank5:radarTANK1
           }
           const inserTANK= insertMessage(tank1,dateString,dataTank1)
        }

        if (cekdata2.length<1)
        {
           var dataTank2={
            distanceTank6:radarTANK2
           }
           const inserTANK2= insertMessage(tank2,dateString,dataTank2);
        }

        if (cekdata3.length<1)
        {
           var dataTank3={
            distanceTank7:radarTANK3
           }
           const inserTANK3= insertMessage(tank3,dateString,dataTank3);
        }

        if (cekdata.length>1)
        {
          var data5= cekdata[0].data;
          var idTank5=cekdata[0].id;
          var tmpdata= JSON.parse(data5);
          if (!tmpdata.hasOwnProperty("distanceTank5")) {
            tmpdata.distanceTank5=radarTANK1;
            updateMessage(idTank5,tmpdata);
          }
        }

        if (cekdata2.length>1)
        {
          var data6= cekdata[0].data;
          var idTank6=cekdata[0].id;
          var tmpdata2= JSON.parse(data6);
          if (!tmpdata2.hasOwnProperty("distanceTank6")) {
            tmpdata2.distanceTank6=radarTANK2;
            updateMessage(idTank6,tmpdata2);
          }
        }

        if (cekdata3.length>1)
        {
          var data7= cekdata[0].data;
          var idTank7=cekdata[0].id;
          var tmpdata3= JSON.parse(data7);
          if (!tmpdata3.hasOwnProperty("distanceTank7")) {
            tmpdata3.distanceTank7=radarTANK3;
            updateMessage(idTank7,tmpdata3);
          }
        }


        /*else
        {
            var data5= cekdata[0].data;
            var idTank5=cekdata[0].id;
            const cekdata6= await Message.findAll({
              where :{id_device:tank2},
              limit:1,
              order:[['id','DESC']]
            });
            const cekdata7= await Message.findAll({
              where :{id_device:tank3},
              limit:1,
              order:[['id','DESC']]
            });
            var data6= cekdata6[0].data;
            var data7= cekdata7[0].data;
            var idTank6=cekdata6[0].id;
            var idTank7=cekdata7[0].id;
            var tmpdata= JSON.parse(data5);
            var tmpdata2=JSON.parse(data6);
            var tmpdata3= JSON.parse(data7);
            if (!tmpdata.hasOwnProperty("distanceTank5")) {
         
              tmpdata.distanceTank5=radarTANK1;
              updateMessage(idTank5,tmpdata);
            }
            if (tmpdata.hasOwnProperty("distanceTank5")) 
            {
              var dataTank1={
                distanceTank5:radarTANK1
               }
              const inserTANK1= insertMessage(tank1,dateString,dataTank1);
  
            }
            if (!tmpdata2.hasOwnProperty("distanceTank6")) {
              
              tmpdata2.distanceTank6=radarTANK2;
              updateMessage(idTank6,tmpdata2);
           }
           if (tmpdata2.hasOwnProperty("distanceTank6"))
           {
            var dataTank2={
              distanceTank6:radarTANK2
             }
            const inserTANK2= insertMessage(tank2,dateString,dataTank2)
           }
  
           if (!tmpdata3.hasOwnProperty("distanceTank7")) {
            tmpdata3.distanceTank7=radarTANK3;
            updateMessage(idTank7,tmpdata3);
          }
          if (tmpdata3.hasOwnProperty("distanceTank6"))
          {
            var dataTank3={
              distanceTank6:radarTANK3
             }
            const inserTANK3= insertMessage(tank3,dateString,dataTank3)
          }*/
        }
      catch(err)
    {
        
       console.log(err);
    }
  }
 if (idDevice=="TASK3TANK1")
  {
      try{
        var ids='TANK1_HP_PAMALIAN';
        var temperatureTASK3TANK1_02= js.sensorDatas[2].value;
        var temperatureTASK3TANK1_2= js.sensorDatas[3].value;
        var temperatureTASK3TANK1_6= js.sensorDatas[4].value;
        var temperatureTASK3TANK1_9= js.sensorDatas[5].value;
        var temperatureTASK3TANK1_12= js.sensorDatas[6].value;
        var radarTank1= js.sensorDatas[7].value;
        var dataTANK1={
          Tank1TASK3_0_2:temperatureTASK3TANK1_02,
          Tank1TASK3_2:temperatureTASK3TANK1_2,
          Tank1TASK3_6:temperatureTASK3TANK1_6,
          Tank1TASK3_9:temperatureTASK3TANK1_9,
          Tank1TASK3_12:temperatureTASK3TANK1_12,
          distanceTank1:radarTank1
        }
        const inserTANK= insertMessage(ids,dateString,dataTANK1)
        var  checkDevs= await checkDevice(ids);
		if (checkDevs.length<1)
		{
		  await createDevice(ids);
		}

        

      }
     catch(err)
    {
       console.log(err);
    }
  }

  if (idDevice=="TASK3TANK2")
  {
      try{
        var ids='TANK2_HP_PAMALIAN';
        var temperatureTASK3TANK2_02= js.sensorDatas[2].value;
        var temperatureTASK3TANK2_2= js.sensorDatas[3].value;
        var temperatureTASK3TANK2_6= js.sensorDatas[4].value;
        var temperatureTASK3TANK2_9= js.sensorDatas[5].value;
        var temperatureTASK3TANK2_12= js.sensorDatas[6].value;
        var radarTank2= js.sensorDatas[7].value;
        var dataTANK1={
          Tank2TASK3_0_2:temperatureTASK3TANK2_02,
          Tank2TASK3_2:temperatureTASK3TANK2_2,
          Tank2TASK3_6:temperatureTASK3TANK2_6,
          Tank2TASK3_9:temperatureTASK3TANK2_9,
          Tank2TASK3_12:temperatureTASK3TANK2_12,
          distanceTank2:radarTank2
        }
        const inserTANK= insertMessage(ids,dateString,dataTANK1);
		var  checkDevs= await checkDevice(ids);
		if (checkDevs.length<1)
		{
		  await createDevice(ids);
		}

       
      }
     catch(err)
    {
       console.log(err);
    }
  }

  if (idDevice=="TASK3TANK3")
  {
      try{
        var ids='TANK3_HP_PAMALIAN';
        var temperatureTASK3TANK3_02= js.sensorDatas[2].value;
        var temperatureTASK3TANK3_2= js.sensorDatas[3].value;
        var temperatureTASK3TANK3_6= js.sensorDatas[4].value;
        var temperatureTASK3TANK3_9= js.sensorDatas[5].value;
        var temperatureTASK3TANK3_12= js.sensorDatas[6].value;
        var radarTank3= js.sensorDatas[7].value;
        var dataTANK1={
          Tank3TASK3_0_2:temperatureTASK3TANK3_02,
          Tank3TASK3_2:temperatureTASK3TANK3_2,
          Tank3TASK3_6:temperatureTASK3TANK3_6,
          Tank3TASK3_9:temperatureTASK3TANK3_9,
          Tank3TASK3_12:temperatureTASK3TANK3_12,
          distanceTank3:radarTank3
        }
        const inserTANK= insertMessage(ids,dateString,dataTANK1)
      
     var  checkDevs= await checkDevice(ids);
		if (checkDevs.length<1)
		{
		  await createDevice(ids);
		}
      }
     catch(err)
    {
       console.log(err);
    }
  }

  if (idDevice=="TASK3TANK4")
  {
      try{
        var ids='TANK4_HP_PAMALIAN';
        var temperatureTASK3TANK4_02= js.sensorDatas[2].value;
        var temperatureTASK3TANK4_2= js.sensorDatas[3].value;
        var temperatureTASK3TANK4_6= js.sensorDatas[4].value;
        var temperatureTASK3TANK4_9= js.sensorDatas[5].value;
        var temperatureTASK3TANK4_12= js.sensorDatas[6].value;
        var radarTank4= js.sensorDatas[7].value;
        var dataTANK1={
          Tank4TASK3_0_2:temperatureTASK3TANK4_02,
          Tank4TASK3_2:temperatureTASK3TANK4_2,
          Tank4TASK3_6:temperatureTASK3TANK4_6,
          Tank4TASK3_9:temperatureTASK3TANK4_9,
          Tank4TASK3_12:temperatureTASK3TANK4_12,
          distanceTank4:radarTank4
        }
        const inserTANK= insertMessage(ids,dateString,dataTANK1)
      var  checkDevs= await checkDevice(ids);
		if (checkDevs.length<1)
		{
		  await createDevice(ids);
		}

      }
     catch(err)
    {
       console.log(err);
    }
  }


  if (idDevice=="temperatureTANK267WSSL")
  {
    
    /*
    tank1=8
    tank2=9
    tank3=10
    tank4=11
    tank5=12
    tank6=13
    tank7=14
    tank8=15
    */
    var tank2='WSSLTANK9';
    var tank6='WSSLTANK14';
    var tank7='WSSLTANK15';
    var temperatureWSSLTANK2_02= js.sensorDatas[2].value;
    var temperatureWSSLTANK2_2= js.sensorDatas[3].value;
    var temperatureWSSLTANK2_5= js.sensorDatas[4].value;
    var temperatureWSSLTANK2_8= js.sensorDatas[5].value;
    var temperatureWSSLTANK2_11= js.sensorDatas[6].value;
    var temperatureWSSLTANK7_02= js.sensorDatas[7].value;
    var temperatureWSSLTANK7_2= js.sensorDatas[8].value;
    var temperatureWSSLTANK7_6= js.sensorDatas[9].value;
    var temperatureWSSLTANK7_9= js.sensorDatas[10].value;
    var temperatureWSSLTANK7_12= js.sensorDatas[11].value;
    var temperatureWSSLTANK8_02= js.sensorDatas[12].value;
    var temperatureWSSLTANK8_2= js.sensorDatas[13].value;
    var temperatureWSSLTANK8_7= js.sensorDatas[14].value;
    var temperatureWSSLTANK8_10= js.sensorDatas[15].value;
    var temperatureWSSLTANK8_14= js.sensorDatas[16].value;
    const cekdata= await Message.findAll({
      where :{id_device:tank2,time:dateString},
      limit:1,
      order:[['time','DESC']]
    });
	 const cekdata2= await Message.findAll({
      where :{id_device:tank6,time:dateString},
      limit:1,
      order:[['time','DESC']]
    });
	
	 const cekdata3= await Message.findAll({
      where :{id_device:tank7,time:dateString},
      limit:1,
      order:[['time','DESC']]
    });
    var checkDevs= await checkDevice(tank2);
    var  checkDevs2= await checkDevice(tank6);
    var  checkDevs3= await checkDevice(tank7);
    if (checkDevs2.length<1)
    {
      await createDevice(tank6);
    }
    if (checkDevs.length<1)
    {
      await createDevice(tank2);
    }

    if (checkDevs3.length<1)
    {
      await createDevice(tank7);
    }
    console.log(cekdata.length);
    if (cekdata.length<1)
    {
      var dataTANK1={
        Tank9WSSL_0_2:temperatureWSSLTANK2_02,
        Tank9WSSL_2:temperatureWSSLTANK2_2,
        Tank9WSSL_5:temperatureWSSLTANK2_5,
        Tank9WSSL_8:temperatureWSSLTANK2_8,
        Tank9WSSL_11:temperatureWSSLTANK2_11,
      }
	  const inserTANK1= insertMessage(tank2,dateString,dataTANK1);
	}
	if (cekdata2.length<1)
    {
	

      var dataTANK2={
        Tank14WSSL_0_2:temperatureWSSLTANK7_02,
        Tank14WSSL_2:temperatureWSSLTANK7_2,
        Tank14WSSL_7:temperatureWSSLTANK7_6,
        Tank14WSSL_10:temperatureWSSLTANK7_9,
        Tank14WSSL_14:temperatureWSSLTANK7_12,
      }
	   const inserTANK2= insertMessage(tank6,dateString,dataTANK2);
	}
	
	if (cekdata3.length<1)
    {

      var dataTANK3={
        Tank15WSSL_0_2:temperatureWSSLTANK8_02,
        Tank15WSSL_2:temperatureWSSLTANK8_2,
        Tank15WSSL_7:temperatureWSSLTANK8_7,
        Tank15WSSL_10:temperatureWSSLTANK8_10,
        Tank15WSSL_14:temperatureWSSLTANK8_14,

      }
	   const inserTANK3= insertMessage(tank7,dateString,dataTANK3);
	}
	
	if (cekdata.length>0)
	{
		var data2= cekdata[0].data;
		var idTank2=cekdata[0].id;
		var tmpdata= JSON.parse(data2);
		if (!tmpdata.hasOwnProperty("Tank9WSSL_0_2")) {
			tmpdata.Tank9WSSL_0_2=temperatureWSSLTANK2_02;
			tmpdata.Tank9WSSL_2=temperatureWSSLTANK2_2;
			tmpdata.Tank9WSSL_5=temperatureWSSLTANK2_5;
			tmpdata.Tank9WSSL_8=temperatureWSSLTANK2_8;
			tmpdata.Tank9WSSL_11=temperatureWSSLTANK2_11;
			updateMessage(idTank2,tmpdata);
		}
	}
	
	if (cekdata2.length>0)
	{
		
		var data6= cekdata2[0].data;
		var idTank6=cekdata2[0].id;
		var tmpdata2=JSON.parse(data6);
		if (!tmpdata2.hasOwnProperty("Tank14WSSL_0_2")) {
			tmpdata2.Tank14WSSL_0_2=temperatureWSSLTANK7_02,
			tmpdata2.Tank14WSSL_2=temperatureWSSLTANK7_2,
			tmpdata2.Tank14WSSL_7=temperatureWSSLTANK7_6,
			tmpdata2.Tank14WSSL_10=temperatureWSSLTANK7_9,
			tmpdata2.Tank14WSSL_14=temperatureWSSLTANK7_12,
			updateMessage(idTank6,tmpdata2);
		}
	}
	
	if (cekdata3.length>0)
	{
		
		var data7= cekdata3[0].data;
		var idTank7=cekdata3[0].id;
		var tmpdata3= JSON.parse(data7);
		if (!tmpdata3.hasOwnProperty("Tank15WSSL_0_2")) {
			tmpdata3.Tank15WSSL_0_2=temperatureWSSLTANK8_02,
			tmpdata3.Tank15WSSL_2=temperatureWSSLTANK8_2,
			tmpdata3.Tank15WSSL_7=temperatureWSSLTANK8_7,
			tmpdata3.Tank15WSSL_10=temperatureWSSLTANK8_10,
			tmpdata3.Tank15WSSL_14=temperatureWSSLTANK8_14,
			updateMessage(idTank7,tmpdata3);
		}
	}
	
	
      
     
     
    
    
  
    
  }

  if (idDevice=="radarTANK267WSSL")
  {
     
        
        var radarTANK2= js.sensorDatas[2].value;
        var radarTANK6= js.sensorDatas[4].value;
        var radarTANK7= js.sensorDatas[6].value;
        var tank2='WSSLTANK9';
        var tank6='WSSLTANK14';
        var tank7='WSSLTANK15';
        const cekdata= await Message.findAll({
          where :{id_device:tank2,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });
		
		const cekdata2= await Message.findAll({
          where :{id_device:tank6,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });
		
		const cekdata3= await Message.findAll({
          where :{id_device:tank7,time:dateString},
          limit:1,
          order:[['time','DESC']]
        });
		
       
        if (cekdata.length<1)
        {
           var dataTank1={
            distanceTank9:radarTANK2
           }
		   const inserTANK1= insertMessage(tank2,dateString,dataTank1);
		   console.log("INSERT RADAR TANK2")
		}
		
		if (cekdata2.length<1)
        {
           var dataTank2={
            distanceTank14:radarTANK6
           }
		    const inserTANK2= insertMessage(tank6,dateString,dataTank2)
					   console.log("INSERT RADAR TANK7")
		}
		if (cekdata3.length<1)
        {
           var dataTank3={
            distanceTank15:radarTANK7
           }
		    const inserTANK3= insertMessage(tank7,dateString,dataTank3)
					   console.log("INSERT RADAR TANK8")
		}
		
		
		if (cekdata.length>0)
		{
			var data2= cekdata[0].data;
            var idTank2=cekdata[0].id;
			var tmpdata= JSON.parse(data2);
			if (!tmpdata.hasOwnProperty("distanceTank9")) {
				tmpdata.distanceTank9=radarTANK2;
				updateMessage(idTank2,tmpdata);
						   console.log("UPDATE RADAR TANK2")
			}
		}
		
		
		if (cekdata2.length>0)
		{
			var data6= cekdata2[0].data;
            var idTank6=cekdata2[0].id;
			var tmpdata2= JSON.parse(data6);
			if (!tmpdata2.hasOwnProperty("distanceTank14")) {
				tmpdata2.distanceTank14=radarTANK6;
				updateMessage(idTank6,tmpdata2);
						   console.log("INSERT RADAR TANK7")
			}
		}
		
		if (cekdata3.length>0)
		{
			var data7= cekdata3[0].data;
            var idTank7=cekdata3[0].id;
			var tmpdata3= JSON.parse(data7);
			if (!tmpdata3.hasOwnProperty("distanceTank15")) {
				tmpdata3.distanceTank15=radarTANK7;
				updateMessage(idTank7,tmpdata3);
						   console.log("INSERT RADAR TANK8")
			}
		}
         
          
          
        
  }	
		
        

  if (idDevice=="TANK13WSSL")
  {
      try{
		
        var ids='WSSLTANK8';
        var ids2='WSSLTANK10';
        var temperatureWSSLTANK3_02= js.sensorDatas[2].value;
        var temperatureWSSLTANK3_2= js.sensorDatas[3].value;
        var temperatureWSSLTANK3_6= js.sensorDatas[4].value;
        var temperatureWSSLTANK3_9= js.sensorDatas[5].value;
        var temperatureWSSLTANK3_12= js.sensorDatas[6].value;
        var radarWSSLTANK3= js.sensorDatas[7].value;
        var temperatureWSSLTANK4_02= js.sensorDatas[8].value;
        var temperatureWSSLTANK4_2= js.sensorDatas[9].value;
        var temperatureWSSLTANK4_6= js.sensorDatas[10].value;
        var temperatureWSSLTANK4_9= js.sensorDatas[11].value;
        var temperatureWSSLTANK4_12= js.sensorDatas[12].value;
        var radar= js.sensorDatas[13].value;
     
        /*var dataTank1={
          Tank8WSSL_0_2:temperatureWSSLTANK3_02,
          Tank8WSSL_2:temperatureWSSLTANK3_2,
          Tank8WSSL_5:temperatureWSSLTANK3_6,
          Tank8WSSL_8:temperatureWSSLTANK3_9,
          Tank8WSSL_11:temperatureWSSLTANK3_12,
          distanceTank8:radarWSSLTANK3
        }
        var dataTank2={
          Tank10WSSL_1:temperatureWSSLTANK4_02,
          Tank10WSSL_3:temperatureWSSLTANK4_2,
          Tank10WSSL_5:temperatureWSSLTANK4_6,
          Tank10WSSL_7:temperatureWSSLTANK4_9,
          Tank10WSSL_11:temperatureWSSLTANK4_12,
          distanceTank10:radar
        }*/
		 var dataTank1={
          Tank8WSSL_0_2:temperatureWSSLTANK4_02,
          Tank8WSSL_2:temperatureWSSLTANK4_2,
          Tank8WSSL_5:temperatureWSSLTANK4_6,
          Tank8WSSL_8:temperatureWSSLTANK4_9,
          Tank8WSSL_11:temperatureWSSLTANK4_12,
          distanceTank8:radar
        }
		var temp0_2= parseFloat(temperatureWSSLTANK3_02)/1000;
		var temp2= parseFloat(temperatureWSSLTANK3_2)/1000;
		var temp7=parseFloat(temperatureWSSLTANK3_6)/1000;
		var temp10=parseFloat(temperatureWSSLTANK3_9)/1000;
		var temp14=parseFloat(temperatureWSSLTANK3_12)/1000;
		var distance=parseFloat(radarWSSLTANK3)/1000;
		var level1=((-1037/(16)*(distance-4)+1037));
		temp0_2=((temp0_2-4)*15.625-50);
		temp2=((temp2-4)*15.625-50);
		temp7=((temp7-4)*15.625-50);
		temp10=((temp10-4)*15.625-50);
		temp14=((temp14-4)*15.625-50);
        var dataTank2={
          Tank10WSSL_0_2:temp0_2,
          Tank10WSSL_2:temp2,
          Tank10WSSL_6:temp7,
          Tank10WSSL_9:temp10,
          Tank10WSSL_12:temp14,
          distanceTank10:level1
        }
        var checkDevs= await checkDevice(ids2);
        var  checkDevs2= await checkDevice(ids);
        if (checkDevs2.length<1)
        {
          createDevice(ids);
        }
        if (checkDevs.length<1)
        {
          createDevice(ids2);
        }
        await insertMessage(ids2,dateString,dataTank2);
        await insertMessage(ids,dateString,dataTank1);
      }

      catch(err)
    {
       console.log(err);
    }
  
    
  }

  if (idDevice=="WSSLTANK45")
  {
      try{
        var ids='WSSLTANK11';
        var ids2='WSSLTANK12';
        
        var temperatureWSSLTANK4_02= js.sensorDatas[2].value;
        var temperatureWSSLTANK4_2= js.sensorDatas[3].value;
        var temperatureWSSLTANK4_6= js.sensorDatas[4].value;
        var temperatureWSSLTANK4_9= js.sensorDatas[5].value;
        var temperatureWSSLTANK4_12= js.sensorDatas[6].value;
        var radarWSSLTANK4= js.sensorDatas[7].value;
        var temperatureWSSLTANK5_02= js.sensorDatas[8].value;
        var temperatureWSSLTANK5_2= js.sensorDatas[9].value;
        var temperatureWSSLTANK5_6= js.sensorDatas[10].value;
        var temperatureWSSLTANK5_9= js.sensorDatas[11].value;
        var temperatureWSSLTANK5_12= js.sensorDatas[12].value;
        var radar= js.sensorDatas[13].value;
	
		var temp0_2= parseFloat(temperatureWSSLTANK4_02)/1000;
		var temp2= parseFloat(temperatureWSSLTANK4_2)/1000;
		var temp7=parseFloat(temperatureWSSLTANK4_6)/1000;
		var temp10=parseFloat(temperatureWSSLTANK4_9)/1000;
		var temp14=parseFloat(temperatureWSSLTANK4_12)/1000;
		var distance=parseFloat(radarWSSLTANK4)/1000;
		var level1=((-1042/(16)*(distance-4)+1042));
		temp0_2=((temp0_2-4)*15.625-50);
		temp2=((temp2-4)*15.625-50);
		temp7=((temp7-4)*15.625-50);
		temp10=((temp10-4)*15.625-50);
		temp14=((temp14-4)*15.625-50);
		
       
        var dataTank1={
          Tank11WSSL_0_2:temp0_2,
          Tank11WSSL_2:temp2,
          Tank11WSSL_6:temp7,
          Tank11WSSL_9:temp10,
          Tank11WSSL_12:temp14,
          distanceTank11:level1
        }
        var dataTank2={
          Tank12WSSL_0_2:temperatureWSSLTANK5_02,
          Tank12WSSL_2:temperatureWSSLTANK5_2,
          Tank12WSSL_4:temperatureWSSLTANK5_6,
          Tank12WSSL_7:temperatureWSSLTANK5_9,
          Tank12WSSL_10:temperatureWSSLTANK5_12,
          distanceTank12:radar
        }
        var checkDevs= await checkDevice(ids);
        var  checkDevs2= await checkDevice(ids2);
        if (checkDevs2.length<1)
        {
          await createDevice(ids2);
        }
        if (checkDevs.length<1)
        {
          await createDevice(ids);
        }
        await insertMessage(ids,dateString,dataTank1);
        await insertMessage(ids2,dateString,dataTank2);
       
      }

      catch(err)
    {
       console.log(err);
    }
  
    
  }
  if (idDevice=="WSSLTANK6")
  {
      try{
		
        var ids='WSSLTANK13';
        var temperatureWSSLTANK6_02= js.sensorDatas[2].value;
        var temperatureWSSLTANK6_2= js.sensorDatas[3].value;
        var temperatureWSSLTANK6_6= js.sensorDatas[4].value;
        var temperatureWSSLTANK6_9= js.sensorDatas[5].value;
        var temperatureWSSLTANK6_12= js.sensorDatas[6].value;
        var radarWSSLTANK6= js.sensorDatas[8].value;
        console.log("RADAR "+radarWSSLTANK6);
        var dataTank1={
          Tank13WSSL_0_2:temperatureWSSLTANK6_02,
          Tank13WSSL_2:temperatureWSSLTANK6_2,
          Tank13WSSL_6:temperatureWSSLTANK6_6,
          Tank13WSSL_9:temperatureWSSLTANK6_9,
          Tank13WSSL_12:temperatureWSSLTANK6_12,
          distanceTank13:radarWSSLTANK6
        }
        var checkDevs= await checkDevice(ids)
        if (checkDevs.length<1)
        {
          await createDevice(ids);
        }
        insertMessage(ids,dateString,dataTank1);
      }

      catch(err)
    {
       console.log(err);
    }
  }

});



async function checkDevice(idDevice)
{
    const checkDev = await  Device.findAll(
        { where: { id_device: idDevice }, raw: true },
    );

    return checkDev;
}

async function createDevice(idDevice)
{
    const devs = await Device.create({
        id_device: idDevice,
        isActive:1,
        token_key:'811aea285d3c31db515c56520ae369aded18a623'
    }); 
    console.log('device created');
    return devs;
}

function DecimalHexTwosComplement(decimal) {
  var size = 8;

  if (decimal >= 0) {
    var hexadecimal = decimal.toString(16);

    while ((hexadecimal.length % size) != 0) {
      hexadecimal = "" + 0 + hexadecimal;
    }

    return hexadecimal;
  } else {
    var hexadecimal = Math.abs(decimal).toString(16);
    while ((hexadecimal.length % size) != 0) {
      hexadecimal = "" + 0 + hexadecimal;
    }

    var output = '';
    for (i = 0; i < hexadecimal.length; i++) {
      output += (0x0F - parseInt(hexadecimal[i], 16)).toString(16);
    }

    output = (0x01 + parseInt(output, 16)).toString(16);
    return output;
  }
}

async function insertMessage(id_device,time,data)
{
  const inserTANK2= await Message.create({
    id_device:id_device,
    time:time,
    seq:0,
    data:JSON.stringify(data),
    id_reception:0,
    rssi:0,
    snr:0
  });
}

async function updateMessage(id,data)
{
  
  const updateMessages = await Message.update(
    {data:JSON.stringify(data)},
    {
      where:{id:id}
    }

  );
}


