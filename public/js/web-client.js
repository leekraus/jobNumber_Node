/**
 * Web-Client Library
 * User: YCotov
 * Date: 29.09.13
 */

$(function() {

    $( "#menu" ).menu();
    $( "#back" ).button();


    $('#back').click(function(){
        $('#menu').toggle();
        $('#charts').toggle();
        $('#res_next_prime').toggle();
    });
    $('#primes-charts').click(function(){

        $.ajax({
            url: '/getchartdata'
        }).done(function(datatext) {
                var data = JSON.parse(datatext);
                $('#menu').toggle();
                $('#charts').show();
                $('#charts').highcharts({
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        text: 'Prime results charts'
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: [{
                    }],
                    yAxis: [{
                        labels: {
                            formatter: function() {
                                return this.value/100 +' t(s)';
                            },
                            style: {
                                color: '#89A54E'
                            }
                        },
                        title: {
                            text: 'Time Spent',
                            style: {
                                color: '#89A54E'
                            }
                        },
                        opposite: true

                    }, { // Secondary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: 'Prime?',
                            style: {
                                color: '#4572A7'
                            }
                        },
                        labels: {
                            /*  formatter: function() {
                             return this.value +' true';
                             },*/
                            style: {
                                color: '#4572A7'
                            }
                        }

                    }, { // Tertiary yAxis
                        gridLineWidth: 0,
                        title: {
                            text: 'Tested Numbers',
                            style: {
                                color: '#AA4643'
                            }
                        },
                        labels: {
                            formatter: function() {
                                return this.value /1000 +'k';
                            },
                            style: {
                                color: '#AA4643'
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 80,
                        floating: true,
                        backgroundColor: '#FFFFFF'
                    },
                    series: [{
                        name: 'Prime?',
                        color: '#4572A7',
                        type: 'column',
                        yAxis: 1,
                        data: data.result,
                        tooltip: {
                            valueSuffix: ' true/false'
                        }

                    }, {
                        name: 'Numbers',
                        type: 'spline',
                        color: '#AA4643',
                        yAxis: 2,
                        data: data.ind,
                        marker: {
                            enabled: true
                        },
                        dashStyle: 'shortdot',
                        tooltip: {
                            valueSuffix: ' t(ms)'
                        }

                    }, {
                        name: 'Time',
                        color: '#89A54E',
                        type: 'spline',
                        data: data.time,
                        tooltip: {
                            valueSuffix: ''
                        }
                    }]

                });
            }).fail(function() {
                throw( "rest getchartdata error" );
            });


    });


    /** Returns astask template
     * @method getTemlate
     * @param o {Object} data from server with current task
     * */

    function getResult(ind){
        for (var i=3; i < ind; i++)
        {
            if (ind % i == 0 )
            {
            return false;
            }
        }
        return true;
    };

     var getTemplate = function(o)
    {
        var parsed = JSON.parse(o);
        var number = parsed.ind;
        var result_template = parsed.realization.replace(/{ind}/g,number);


        //$("#calculations")[0].text ='';
        //$("#calculations")[0].text = result_template;

        //TODO apply worker
        var start = performance.now();
        var result = getResult(parseInt(number));
        var end = performance.now();

        return {result: result, ind: number, runtime: (end-start)};
    };
    $('#res_next_prime').toggle();
    $('#next_prime').click(function(){
        $('#res_next_prime').show();
        $.ajax({
            url: '/gettask',
            type:'GET',
            async:true,
            beforeSend: function( xhr ) {
                xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
                // xhr.overrideMimeType();
            }
        })
            .done(function( data ) {
                rees = getTemplate(data);
                $('#res_next_prime').html(rees.result==true ? "Next Number["+ rees.ind+"] is Prime" : "Next Number"+rees.ind+" isn't Prime" );
            });
    });
});
