var ZMap = ZMap || { Version : 1.0};

var fsj="";

ZMap.MultiView = function ()
{
    this.mViews = [];
};


ZMap.MultiView.prototype = {

    /// 构造函数
    constructor: ZMap.MultiView,

    /// 视图列表
    mViews: null,

    ///
    mTimer: 0,

    ///
    mGap: 1000,

    /// 
    add2dView: function (map)
    {
        var view = new ZMap.MultiView.View2D(map);
        view.LastPose = null;
        this.mViews.push(view);
    },
    
    get2dView: function()
    {
        return this.mViews[0];
    },
    
    /// 添加视图
    add3dView: function (window)
    {
        var view = new ZMap.MultiView.View3D(window)
        view.LastPose = null;
        this.mViews.push(view);
    },
    
    get3dView: function()
    {
        return this.mViews[1];
    },

    /// 情况视图
    clearViews: function ()
    {
        this.mViews = [];
    },

    setPose: function (pose)
    {
        for (var i = 0; i < this.mViews.length; ++i)
        {
            this.mViews[i].setPose(pose);
        }
    },

    /// 
    startLink: function (gap)
    {
        if (gap > 0)
            this.mGap = gap;

        this.loop();
    },

    /// 
    stopLink: function ()
    {
        if (this.mTimer !== 0)
        {
            clearTimeout(this.mTimer);
            this.mTimer = 0;
        }
    },

    loop: function ()
    {
        ///
        this.doLink();

        ///
        var self = this;
        this.mTimer = setTimeout(function ()
        {
            self.loop();
        }, this.mGap);
    },

    /// 
    doLink: function ()
    {
        var mo = this.checkMove();
        if (mo)
        {
            for (var i = 0; i < this.mViews.length; ++i)
            {
                var v = this.mViews[i];
                if (i != mo[0])
                {
                   // mo[1].push(["tilt",fsj]);
                    v.setPose(mo[1]);
                    v.lastPose = v.getPose();
                }
            }
        }
    },

    /// 
    checkMove: function ()
    {
        for (var i = 0; i < this.mViews.length; ++i)
        {
            var v = this.mViews[i];
            var pose = v.getPose();

            if (v.lastPose == null)
                v.lastPose = pose;

            ///
            if (!this.checkEqual(v.lastPose, pose))
            {
                v.lastPose = pose;
                return [i, pose];
            }
        }

        return null;
    },

    checkEqual: function (e1, e2)
    {
        if (e1.x != e2.x)
            return false;
        if (e1.y != e2.y)
            return false;
        if (e1.z != e2.z)
            return false;

        ///
        return true;
    }
};

ZMap.MultiView.View2D = function(mapview)
{
    this.mapview = mapview;
};


ZMap.MultiView.View2D.prototype = {
    /// 构造函数
    constructor: ZMap.MultiView.View2D,
    /// 
    mapview: null,
    /// 
    getPose: function()
    {
        var ct = this.mapview.GetViewCenter();
        return {
            x: ct[0],
            y: ct[1],
            z: this.mapview.GetZoom()
        };
    },
    ///
    setPose: function(ex)
    {
        if (isNaN(ex.x) || isNaN(ex.y))
        {
            return ;
        }     
        this.mapview.SetViewCenter(ex.x, ex.y);
        this.mapview.SetZoom(ex.z);
    }
};

ZMap.MultiView.View3D = function(mapwindow)
{
    this.mapwindow = mapwindow;
};


ZMap.MultiView.View3D.prototype = {
    /// 构造函数
    constructor: ZMap.MultiView.View3D,
    /// 
    mapwindow: null,
    /// 
    getPose: function ()
    {
        //return mapview.GetViewRect();
        var info = this.mapwindow.zMapNavigate.GetViewInfo().split(',');
        fsj=parseFloat(info[5]);
        return {
            x: parseFloat(info[0]),
            y: parseFloat(info[1]),
            z: this.getZoom(parseFloat(info[3])),
            head:parseFloat(info[4]),
            tilt:fsj
        };
    },
    ///
    setPose: function (pose)
    {
        //var pose = this.rect2Pose(extent);
        var dist = this.setZoom(pose.z);        
        var head = pose.head ? pose.head : 0;
        fsj      = pose.tilt ? pose.tilt : fsj;   
        
        if (isNaN(pose.x) || isNaN(pose.y))
        {
            return ;
        }    
        this.mapwindow.zMapNavigate.SetInitPose(pose.x, pose.y, 0, dist, head, fsj);
    },

    dmap: [30718560, 15359280, 7679640, 3839820, 1864950, 1724000,
        681170, 438050, 217740, 160370, 29310, 15150, 7340, 3700, 1880, 928, 450, 200, 100, 50],

    getZoom: function (d)
    {
        for (var i = 0; i < this.dmap.length; ++i)
        {
            if (d >= this.dmap[i])
            {
                return i + 1;
            }
        }

        return this.dmap.length + 1;
    },

    setZoom: function (z)
    {
        if (z > this.dmap.length)
            return 50;

        return this.dmap[z - 1];
    }
};

