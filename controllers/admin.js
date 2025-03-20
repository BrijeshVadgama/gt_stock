import { authDbConnection, authsequelizeInstance } from "../db.js";
import { validationOrder } from "../validation/order.validation.js";
import { validationOrderCart } from "../validation/orderCart.validation.js";

/* export const getDataList = async (req, res) => {
  try {
    const { search } = req.query;
    const sequelize = req.sequelize;
    //     const query = `
    //     SELECT
    //         DesignName.DesignName,
    //         Shade.ShName,
    //         SizeName.SizeName,
    //         CatName.CatName,
    //         SUM(SubDesign.G1) AS SumOfG1
    //     FROM
    //         (((DesignName
    //         INNER JOIN SubDesign ON DesignName.GenCode = SubDesign.GenCode)
    //         INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode)
    //         INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode)
    //         INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
    //     ${searchCondition}
    //     GROUP BY
    //         DesignName.DesignName,
    //         Shade.ShName,
    //         SizeName.SizeName,
    //         CatName.CatName,
    //         DesignName.GenCode
    //     HAVING
    //         SUM(SubDesign.G1) != 0;
    // `;

    const query = `
        -- Declare variables
        DECLARE @v_GenCode NVARCHAR(50),
                @v_ShCode NVARCHAR(50),
                @v_BtCode NVARCHAR(50),
                @v_MsCode NVARCHAR(50),
                @v_DesignName NVARCHAR(100),
                @v_CatName NVARCHAR(100),
                @v_ShName NVARCHAR(100),
                @v_SizeName NVARCHAR(100),
                @v_BrandName NVARCHAR(100),
                @v_SeriesName NVARCHAR(100),
                @v_FGName NVARCHAR(100),
                @v_DTName NVARCHAR(100),
                @v_DSName NVARCHAR(100),
                @v_PcsBox INT,
                @v_BtBoxWt DECIMAL(18, 2),
                @v_SqFeet NVARCHAR(100),
                @v_SqMtr NVARCHAR(100),
                @v_DesignAct NVARCHAR(100),
                @v_BPName NVARCHAR(100),
                @v_G1 DECIMAL(10, 2),
                @v_G2 DECIMAL(10, 2),
                @v_G3 DECIMAL(10, 2),
                @v_G4 DECIMAL(10, 2),
                @v_G5 DECIMAL(10, 2),
                @v_Gtot DECIMAL(10, 2),
                @v_OQ1 DECIMAL(10, 2),
                @v_OQ2 DECIMAL(10, 2),
                @v_OQ3 DECIMAL(10, 2),
                @v_OQ4 DECIMAL(10, 2),
                @v_OQ5 DECIMAL(10, 2),
                @v_OQtot DECIMAL(10, 2),
                @v_AOQ1 DECIMAL(10, 2),
                @v_AOQ2 DECIMAL(10, 2),
                @v_AOQ3 DECIMAL(10, 2),
                @v_AOQ4 DECIMAL(10, 2),
                @v_AOQ5 DECIMAL(10, 2),
                @v_AOQtot DECIMAL(10, 2),
                @v_SumOfG1 DECIMAL(10, 2),
                @v_PfCode NVARCHAR(50),
                @v_OrderQty DECIMAL(10, 2),
                @v_CurrStockQty DECIMAL(10, 2),
                @v_AfterOrderQty DECIMAL(10, 2),
                @searchCondition NVARCHAR(100);
        
        -- Set search condition
        SET @searchCondition = :searchCondition;
        
        -- Create temporary table
        CREATE TABLE #TempTable (
            GenCode NVARCHAR(50),
            ShCode NVARCHAR(50),
            btCode NVARCHAR(50),
            msCode NVARCHAR(50),
            DesignName NVARCHAR(100),
            CatName NVARCHAR(100),
            ShName NVARCHAR(100),
            SizeName NVARCHAR(100),
            BrandName NVARCHAR(100),
            SeriesName NVARCHAR(100),
            FGName NVARCHAR(100),
            DTName NVARCHAR(100),
            DSName NVARCHAR(100),
            PcsBox INT,
            BtBoxWt DECIMAL(18, 2),
            SqFeet NVARCHAR(100),
            SqMtr NVARCHAR(100),
            DesignAct NVARCHAR(100),
            BPName NVARCHAR(100),
            G1 DECIMAL(18, 2),
            G2 DECIMAL(18, 2),
            G3 DECIMAL(18, 2),
            G4 DECIMAL(18, 2),
            G5 DECIMAL(18, 2),
            Gtot DECIMAL(18, 2),
            OQ1 DECIMAL(18, 2),
            OQ2 DECIMAL(18, 2),
            OQ3 DECIMAL(18, 2),
            OQ4 DECIMAL(18, 2),
            OQ5 DECIMAL(18, 2),
            OQtot DECIMAL(18, 2),
            AOQ1 DECIMAL(18, 2),
            AOQ2 DECIMAL(18, 2),
            AOQ3 DECIMAL(18, 2),
            AOQ4 DECIMAL(18, 2),
            AOQ5 DECIMAL(18, 2),
            AOQtot DECIMAL(18, 2),
            SumOfG1 DECIMAL(18, 2)
        );
        
        -- Define cursor
        DECLARE cur CURSOR FOR
        SELECT
            SubDesign.GenCode,
            SubDesign.ShCode,
            SubDesign.BtCode,
            SubDesign.MsCode,
            DesignName.DesignName,
            CatName.CatName,
            Shade.ShName,
            SizeName.SizeName,
            MIN(BrandName.BrandName) AS FirstOfBrandName,
            MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
            MIN(FinishGlaze.FGName) AS FirstOfFGName,
            MIN(DesignType.DTName) AS FirstOfDTName,
            MIN(DesignStatus.DSName) AS FirstOfDSName,
            MIN(SizeName.PcsBox) AS FirstOfPcsBox,
            MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
            MIN(SizeName.SqFeet) AS FirstOfSqFeet,
            MIN(SizeName.SqMtr) AS FirstOfSqMtr,
            MIN(DesignName.DesignAct) AS FirstOfDesignAct,
            MIN(BPName.BPName) AS FirstOfBPName,
            SUM(SubDesign.G1) AS G1,
            SUM(SubDesign.G2) AS G2,
            SUM(SubDesign.G3) AS G3,
            SUM(SubDesign.G4) AS G4,
            SUM(SubDesign.G5) AS G5,
            SUM(SubDesign.Gtot) AS Gtot,
            SUM(SubDesign.OQ1) AS OQ1,
            SUM(SubDesign.OQ2) AS OQ2,
            SUM(SubDesign.OQ3) AS OQ3,
            SUM(SubDesign.OQ4) AS OQ4,
            SUM(SubDesign.OQ5) AS OQ5,
            SUM(SubDesign.OQtot) AS OQtot,
            SUM(SubDesign.AOQ1) AS AOQ1,
            SUM(SubDesign.AOQ2) AS AOQ2,
            SUM(SubDesign.AOQ3) AS AOQ3,
            SUM(SubDesign.AOQ4) AS AOQ4,
            SUM(SubDesign.AOQ5) AS AOQ5,
            SUM(SubDesign.AOQtot) AS AOQtot,
            SUM(SubDesign.G1) AS SumOfG1
        FROM
            SubDesign
            INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
            INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode
            INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
            INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode
            INNER JOIN SeriesName ON DesignName.SeriesCode = SeriesName.SeriesCode
            INNER JOIN FinishGlaze ON DesignName.FGCode = FinishGlaze.FGCode
            INNER JOIN DesignType ON DesignName.DTCode = DesignType.DTCode
            INNER JOIN DesignStatus ON DesignName.DSCode = DesignStatus.DSCode
            INNER JOIN BPName ON DesignName.BPCode = BPName.BPCode
            INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
        WHERE
            DesignName.DesignName LIKE @searchCondition
        GROUP BY
            SubDesign.GenCode, SubDesign.ShCode, SubDesign.BtCode, SubDesign.MsCode, DesignName.DesignName, CatName.CatName, Shade.ShName, SizeName.SizeName;
        
        -- Open cursor
        OPEN cur;
        FETCH NEXT FROM cur INTO
            @v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
            @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
            @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
            @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
            @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
            @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot,
            @v_SumOfG1;
        
        -- Process each row
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insert into temp table
            INSERT INTO #TempTable
            (GenCode, ShCode, BtCode, MsCode, DesignName, CatName, ShName, SizeName, BrandName, SeriesName, FGName, DTName, DSName, PcsBox, BtBoxWt, SqFeet, SqMtr, DesignAct, BPName, G1, G2, G3, G4, G5, Gtot, OQ1, OQ2, OQ3, OQ4, OQ5, OQtot, AOQ1, AOQ2, AOQ3, AOQ4, AOQ5, AOQtot, SumOfG1)
            VALUES
            (@v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
             @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
             @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
             @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
             @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
             @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot, @v_SumOfG1);
        
            FETCH NEXT FROM cur INTO
                @v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
                @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
                @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
                @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
                @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
                @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot,
                @v_SumOfG1;
        END;
        
        -- Close and deallocate cursor
        CLOSE cur;
        DEALLOCATE cur;
        
        -- Return results
        SELECT * FROM #TempTable;
        
        -- Drop temp table
        DROP TABLE #TempTable;
        `;

    const searchString = `%${search}%`; // Replace with the actual search term
    const results = await sequelize.query(query, {
      replacements: { searchCondition: searchString },
      type: sequelize.QueryTypes.SELECT,
    });

    const grQuery = `
        SELECT * FROM GrName;
        `;

    const grResult = await sequelize.query(grQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: { results, grResult },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
}; */

export const getDataList = async (req, res) => {
  try {
    const { search } = req.query;
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const query = `
        -- Declare variables
        DECLARE @v_GenCode NVARCHAR(50),
                @v_ShCode NVARCHAR(50),
                @v_BtCode NVARCHAR(50),
                @v_MsCode NVARCHAR(50),
                @v_DesignName NVARCHAR(100),
                @v_CatName NVARCHAR(100),
                @v_ShName NVARCHAR(100),
                @v_SizeName NVARCHAR(100),
                @v_BrandName NVARCHAR(100),
                @v_SeriesName NVARCHAR(100),
                @v_FGName NVARCHAR(100),
                @v_DTName NVARCHAR(100),
                @v_DSName NVARCHAR(100),
                @v_PcsBox INT,
                @v_BtBoxWt DECIMAL(18, 2),
                @v_SqFeet NVARCHAR(100),
                @v_SqMtr NVARCHAR(100),
                @v_DesignAct NVARCHAR(100),
                @v_BPName NVARCHAR(100),
                @v_G1 DECIMAL(10, 2),
                @v_G2 DECIMAL(10, 2),
                @v_G3 DECIMAL(10, 2),
                @v_G4 DECIMAL(10, 2),
                @v_G5 DECIMAL(10, 2),
                @v_Gtot DECIMAL(10, 2),
                @v_OQ1 DECIMAL(10, 2),
                @v_OQ2 DECIMAL(10, 2),
                @v_OQ3 DECIMAL(10, 2),
                @v_OQ4 DECIMAL(10, 2),
                @v_OQ5 DECIMAL(10, 2),
                @v_OQtot DECIMAL(10, 2),
                @v_AOQ1 DECIMAL(10, 2),
                @v_AOQ2 DECIMAL(10, 2),
                @v_AOQ3 DECIMAL(10, 2),
                @v_AOQ4 DECIMAL(10, 2),
                @v_AOQ5 DECIMAL(10, 2),
                @v_AOQtot DECIMAL(10, 2),
                @v_SumOfG1 DECIMAL(10, 2),
                @searchCondition NVARCHAR(100),
                @totalCount INT;
        
        -- Set search condition
        SET @searchCondition = :searchCondition;
        
        -- Get total count
        SELECT @totalCount = COUNT(*)
        FROM [csstock].[dbo].[SubDesign]
        INNER JOIN [csstock].[dbo].[DesignName] ON SubDesign.GenCode = DesignName.GenCode
        WHERE [csstock].[dbo].[DesignName].DesignName LIKE @searchCondition;

        -- Create temporary table
        CREATE TABLE #TempTable (
            GenCode NVARCHAR(50),
            ShCode NVARCHAR(50),
            btCode NVARCHAR(50),
            msCode NVARCHAR(50),
            DesignName NVARCHAR(100),
            CatName NVARCHAR(100),
            ShName NVARCHAR(100),
            SizeName NVARCHAR(100),
            BrandName NVARCHAR(100),
            SeriesName NVARCHAR(100),
            FGName NVARCHAR(100),
            DTName NVARCHAR(100),
            DSName NVARCHAR(100),
            PcsBox INT,
            BtBoxWt DECIMAL(18, 2),
            SqFeet NVARCHAR(100),
            SqMtr NVARCHAR(100),
            DesignAct NVARCHAR(100),
            BPName NVARCHAR(100),
            G1 DECIMAL(18, 2),
            G2 DECIMAL(18, 2),
            G3 DECIMAL(18, 2),
            G4 DECIMAL(18, 2),
            G5 DECIMAL(18, 2),
            Gtot DECIMAL(18, 2),
            OQ1 DECIMAL(18, 2),
            OQ2 DECIMAL(18, 2),
            OQ3 DECIMAL(18, 2),
            OQ4 DECIMAL(18, 2),
            OQ5 DECIMAL(18, 2),
            OQtot DECIMAL(18, 2),
            AOQ1 DECIMAL(18, 2),
            AOQ2 DECIMAL(18, 2),
            AOQ3 DECIMAL(18, 2),
            AOQ4 DECIMAL(18, 2),
            AOQ5 DECIMAL(18, 2),
            AOQtot DECIMAL(18, 2),
            SumOfG1 DECIMAL(18, 2)
        );
        
        -- Define cursor
        DECLARE cur CURSOR FOR
        SELECT
            SubDesign.GenCode,
            SubDesign.ShCode,
            SubDesign.BtCode,
            SubDesign.MsCode,
            DesignName.DesignName,
            CatName.CatName,
            Shade.ShName,
            SizeName.SizeName,
            MIN(BrandName.BrandName) AS FirstOfBrandName,
            MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
            MIN(FinishGlaze.FGName) AS FirstOfFGName,
            MIN(DesignType.DTName) AS FirstOfDTName,
            MIN(DesignStatus.DSName) AS FirstOfDSName,
            MIN(SizeName.PcsBox) AS FirstOfPcsBox,
            MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
            MIN(SizeName.SqFeet) AS FirstOfSqFeet,
            MIN(SizeName.SqMtr) AS FirstOfSqMtr,
            MIN(DesignName.DesignAct) AS FirstOfDesignAct,
            MIN(BPName.BPName) AS FirstOfBPName,
            SUM(SubDesign.G1) AS G1,
            SUM(SubDesign.G2) AS G2,
            SUM(SubDesign.G3) AS G3,
            SUM(SubDesign.G4) AS G4,
            SUM(SubDesign.G5) AS G5,
            SUM(SubDesign.Gtot) AS Gtot,
            SUM(SubDesign.OQ1) AS OQ1,
            SUM(SubDesign.OQ2) AS OQ2,
            SUM(SubDesign.OQ3) AS OQ3,
            SUM(SubDesign.OQ4) AS OQ4,
            SUM(SubDesign.OQ5) AS OQ5,
            SUM(SubDesign.OQtot) AS OQtot,
            SUM(SubDesign.AOQ1) AS AOQ1,
            SUM(SubDesign.AOQ2) AS AOQ2,
            SUM(SubDesign.AOQ3) AS AOQ3,
            SUM(SubDesign.AOQ4) AS AOQ4,
            SUM(SubDesign.AOQ5) AS AOQ5,
            SUM(SubDesign.AOQtot) AS AOQtot,
            SUM(SubDesign.G1) AS SumOfG1
        FROM
            [csstock].[dbo].[SubDesign]
            INNER JOIN [csstock].[dbo].[DesignName] ON SubDesign.GenCode = DesignName.GenCode
            INNER JOIN [csstock].[dbo].[SizeName] ON DesignName.SizeCode = SizeName.SizeCode
            INNER JOIN [csstock].[dbo].[Shade] ON SubDesign.ShCode = Shade.ShCode
            INNER JOIN [csstock].[dbo].[BrandName] ON DesignName.BrandCode = BrandName.BrandCode
            INNER JOIN [csstock].[dbo].[SeriesName] ON DesignName.SeriesCode = SeriesName.SeriesCode
            INNER JOIN [csstock].[dbo].[FinishGlaze] ON DesignName.FGCode = FinishGlaze.FGCode
            INNER JOIN [csstock].[dbo].[DesignType] ON DesignName.DTCode = DesignType.DTCode
            INNER JOIN [csstock].[dbo].[DesignStatus] ON DesignName.DSCode = DesignStatus.DSCode
            INNER JOIN [csstock].[dbo].[BPName] ON DesignName.BPCode = BPName.BPCode
            INNER JOIN [csstock].[dbo].[CatName] ON DesignName.CatCode = CatName.CatCode
        WHERE
            [csstock].[dbo].[DesignName].DesignName LIKE @searchCondition
        GROUP BY
            [csstock].[dbo].[SubDesign].GenCode, SubDesign.ShCode, SubDesign.BtCode, SubDesign.MsCode, 
            DesignName.DesignName, CatName.CatName, Shade.ShName, SizeName.SizeName
        ORDER BY DesignName.DesignName
        OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;
        
        -- Open cursor
        OPEN cur;
        FETCH NEXT FROM cur INTO
            @v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
            @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
            @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
            @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
            @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
            @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot,
            @v_SumOfG1;
        
        -- Process each row
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insert into temp table
            INSERT INTO #TempTable
            (GenCode, ShCode, BtCode, MsCode, DesignName, CatName, ShName, SizeName, BrandName, SeriesName, FGName, DTName, DSName, PcsBox, BtBoxWt, SqFeet, SqMtr, DesignAct, BPName, G1, G2, G3, G4, G5, Gtot, OQ1, OQ2, OQ3, OQ4, OQ5, OQtot, AOQ1, AOQ2, AOQ3, AOQ4, AOQ5, AOQtot, SumOfG1)
            VALUES
            (@v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
             @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
             @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
             @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
             @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
             @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot, @v_SumOfG1);
        
            FETCH NEXT FROM cur INTO
                @v_GenCode, @v_ShCode, @v_BtCode, @v_MsCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
                @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
                @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
                @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
                @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
                @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot,
                @v_SumOfG1;
        END;
        
        -- Close and deallocate cursor
        CLOSE cur;
        DEALLOCATE cur;
        
        -- Return results with total count
        SELECT 
            (SELECT * FROM #TempTable FOR JSON PATH) as results,
            @totalCount as totalCount;
        
        -- Drop temp table
        DROP TABLE #TempTable;
    `;

    const searchString = `%${search}%`;
    const results = await sequelize.query(query, {
      replacements: {
        searchCondition: searchString,
        offset: offset,
        limit: limit,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    const grQuery = `
        SELECT * FROM [csstock].[dbo].[GrName];
    `;

    const grResult = await sequelize.query(grQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    // Parse the JSON string from results
    const paginatedResults = results[0].results
      ? JSON.parse(results[0].results)
      : [];
    const totalRecord = results[0].totalCount || 0;
    const totalPage = Math.ceil(totalRecord / limit);

    res.status(200).json({
      status: 200,
      success: true,
      totalRecord,
      totalPage,
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: {
        results: paginatedResults,
        grResult,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const getDetails = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.body;
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const offset = (page - 1) * limit;

    // Main query with pagination
    const query = `
      SELECT BrandName.BrandName, CatName.CatName, GrName.GrName, DesignName.DesignName, 
             DesignName.G1, DesignName.G2, DesignName.G3, DesignName.G4, 
             DesignName.OQ1, DesignName.OQ2, DesignName.OQ3, DesignName.OQ4, 
             DesignName.AOQ1, DesignName.AOQ2, DesignName.AOQ3, DesignName.AOQ4
      FROM [csstock].[dbo].[GrName], 
           ([csstock].[dbo].[DesignName] 
           INNER JOIN [csstock].[dbo].[BrandName] ON DesignName.BrandCode = BrandName.BrandCode) 
           INNER JOIN [csstock].[dbo].[CatName] ON DesignName.CatCode = CatName.CatCode
      ORDER BY DesignName.DesignName
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY;
    `;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM [csstock].[dbo].[GrName], 
           ([csstock].[dbo].[DesignName] 
           INNER JOIN [csstock].[dbo].[BrandName] ON DesignName.BrandCode = BrandName.BrandCode) 
           INNER JOIN [csstock].[dbo].[CatName] ON DesignName.CatCode = CatName.CatCode;
    `;

    const totalCountResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    const totalRecords = totalCountResult[0]?.totalCount || 0;

    res.status(200).json({
      status: 200,
      success: true,
      totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
      limit,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

export const filterStockDetails = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    let {
      prdtCode,
      brandCode,
      bpCode,
      sizeCode,
      catCode,
      fgCode,
      seriesCode,
      designType,
      dsCode,
      cptCode,
      msCode,
      btCode,
      cCode,
      page = 1,
      limit = 10,
    } = req.body;

    // Convert params to arrays if not already
    prdtCode = prdtCode
      ? Array.isArray(prdtCode)
        ? prdtCode
        : [prdtCode]
      : [];
    brandCode = brandCode
      ? Array.isArray(brandCode)
        ? brandCode
        : [brandCode]
      : [];
    bpCode = bpCode ? (Array.isArray(bpCode) ? bpCode : [bpCode]) : [];
    sizeCode = sizeCode
      ? Array.isArray(sizeCode)
        ? sizeCode
        : [sizeCode]
      : [];
    catCode = catCode ? (Array.isArray(catCode) ? catCode : [catCode]) : [];
    fgCode = fgCode ? (Array.isArray(fgCode) ? fgCode : [fgCode]) : [];
    seriesCode = seriesCode
      ? Array.isArray(seriesCode)
        ? seriesCode
        : [seriesCode]
      : [];
    designType = designType
      ? Array.isArray(designType)
        ? designType
        : [designType]
      : [];
    dsCode = dsCode ? (Array.isArray(dsCode) ? dsCode : [dsCode]) : [];
    cptCode = cptCode ? (Array.isArray(cptCode) ? cptCode : [cptCode]) : [];
    msCode = msCode ? (Array.isArray(msCode) ? msCode : [msCode]) : [];
    btCode = btCode ? (Array.isArray(btCode) ? btCode : [btCode]) : [];
    cCode = cCode ? (Array.isArray(cCode) ? cCode : [cCode]) : [];

    // Pagination calculation
    const offset = (page - 1) * limit;

    let conditions = [];
    let replacements = {};

    if (prdtCode.length > 0) {
      conditions.push(`pn.PrdtCode IN (:prdtCode)`);
      replacements.prdtCode = prdtCode;
    }

    if (brandCode.length > 0) {
      conditions.push(`bn.BrandCode IN (:brandCode)`);
      replacements.brandCode = brandCode;
    }

    if (bpCode.length > 0) {
      conditions.push(`bxn.BPCode IN (:bpCode)`);
      replacements.bpCode = bpCode;
    }

    if (sizeCode.length > 0) {
      conditions.push(`sn.SizeCode IN (:sizeCode)`);
      replacements.sizeCode = sizeCode;
    }

    if (catCode.length > 0) {
      conditions.push(`cn.CatCode IN (:catCode)`);
      replacements.catCode = catCode;
    }

    if (fgCode.length > 0) {
      conditions.push(`fg.FGCode IN (:fgCode)`);
      replacements.fgCode = fgCode;
    }

    if (seriesCode.length > 0) {
      conditions.push(`sen.SeriesCode IN (:seriesCode)`);
      replacements.seriesCode = seriesCode;
    }

    if (designType.length > 0) {
      conditions.push(`dt.DTCode IN (:designType)`);
      replacements.designType = designType;
    }

    if (dsCode.length > 0) {
      conditions.push(`ds.DSCode IN (:dsCode)`);
      replacements.dsCode = dsCode;
    }

    if (cptCode.length > 0) {
      conditions.push(`c.CptCode IN (:cptCode)`);
      replacements.cptCode = cptCode;
    }

    if (msCode.length > 0) {
      conditions.push(`ms.MsCode IN (:msCode)`);
      replacements.msCode = msCode;
    }

    if (btCode.length > 0) {
      conditions.push(`b.BtCode IN (:btCode)`);
      replacements.btCode = btCode;
    }

    if (cCode.length > 0) {
      conditions.push(`csn.CCode IN (:cCode)`);
      replacements.cCode = cCode;
    }

    // Get total record count before applying pagination
    let countQuery = `
      SELECT COUNT(*) AS totalRecords
      FROM [csstock].[dbo].[DesignName] dn
      LEFT JOIN [csstock].[dbo].[PrdtName] pn 
        ON dn.PrdtCode = pn.PrdtCode
      LEFT JOIN [csstock].[dbo].[BrandName] bn 
        ON bn.BrandCode = dn.BrandCode
      LEFT JOIN [csstock].[dbo].[BPName] bxn 
        ON bxn.BPCode = dn.BPCode
      LEFT JOIN [csstock].[dbo].[SizeName] sn 
        ON sn.SizeCode = dn.SizeCode
      LEFT JOIN [csstock].[dbo].[CatName] cn 
        ON cn.CatCode = dn.CatCode
      LEFT JOIN [csstock].[dbo].[FinishGlaze] fg 
        ON fg.FGCode = dn.FGCode
      LEFT JOIN [csstock].[dbo].[SeriesName] sen 
        ON sen.SeriesCode = dn.SeriesCode
      LEFT JOIN [csstock].[dbo].[DesignType] dt 
        ON dt.DTCode = dn.DTCode
      LEFT JOIN [csstock].[dbo].[DesignStatus] ds 
        ON ds.DSCode = dn.DSCode
      LEFT JOIN [csstock].[dbo].[Concept] c 
        ON c.CptCode = dn.CptCode
      LEFT JOIN [csstock].[dbo].[SubDesign] sd 
        ON dn.GenCode = sd.GenCode
      LEFT JOIN [csstock].[dbo].[MfgStatus] ms 
        ON ms.MsCode = sd.MsCode
      LEFT JOIN [csstock].[dbo].[Batch] b 
        ON b.BtCode = sd.BtCode
      LEFT JOIN [csstock].[dbo].[CustDesign] cd 
        ON cd.GenCode = dn.GenCode
      LEFT JOIN [csstock].[dbo].[CustName] csn 
        ON csn.CCode = cd.CCode
    `;

    if (conditions.length > 0) {
      countQuery += ` WHERE ` + conditions.join(" AND ");
    }

    const totalCountResult = await sequelize.query(countQuery, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const totalRecords = totalCountResult[0].totalRecords;

    // Build main query with pagination
    let query = `
      SELECT dn.*, pn.*, bn.*, bxn.*, sn.*, cn.*, fg.*, sen.*, dt.*, ds.*, c.*, sd.*, ms.*, b.*, cd.*, csn.*
      FROM [csstock].[dbo].[DesignName] dn
      LEFT JOIN [csstock].[dbo].[PrdtName] pn 
        ON dn.PrdtCode = pn.PrdtCode
      LEFT JOIN [csstock].[dbo].[BrandName] bn 
        ON bn.BrandCode = dn.BrandCode
      LEFT JOIN [csstock].[dbo].[BPName] bxn 
        ON bxn.BPCode = dn.BPCode
      LEFT JOIN [csstock].[dbo].[SizeName] sn 
        ON sn.SizeCode = dn.SizeCode
      LEFT JOIN [csstock].[dbo].[CatName] cn 
        ON cn.CatCode = dn.CatCode
      LEFT JOIN [csstock].[dbo].[FinishGlaze] fg 
        ON fg.FGCode = dn.FGCode
      LEFT JOIN [csstock].[dbo].[SeriesName] sen 
        ON sen.SeriesCode = dn.SeriesCode
      LEFT JOIN [csstock].[dbo].[DesignType] dt 
        ON dt.DTCode = dn.DTCode
      LEFT JOIN [csstock].[dbo].[DesignStatus] ds 
        ON ds.DSCode = dn.DSCode
      LEFT JOIN [csstock].[dbo].[Concept] c 
        ON c.CptCode = dn.CptCode
      LEFT JOIN [csstock].[dbo].[SubDesign] sd 
        ON dn.GenCode = sd.GenCode
      LEFT JOIN [csstock].[dbo].[MfgStatus] ms 
        ON ms.MsCode = sd.MsCode
      LEFT JOIN [csstock].[dbo].[Batch] b 
        ON b.BtCode = sd.BtCode
      LEFT JOIN [csstock].[dbo].[CustDesign] cd 
        ON cd.GenCode = dn.GenCode
      LEFT JOIN [csstock].[dbo].[CustName] csn 
        ON csn.CCode = cd.CCode
    `;

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY dn.PrdtCode OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;

    // Execute query
    const responseData = await sequelize.query(query, {
      replacements: { ...replacements, offset, limit },
      type: sequelize.QueryTypes.SELECT,
    });

    // Return response with pagination
    res.status(200).json({
      status: 200,
      success: true,
      totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
      limit,
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const stockDetails = async (req, res) => {
  try {
    const { gencode } = req.params;
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    // First Query: Fetch Brand-wise Stock Summary
    const stockQuery = `
            SELECT
                BN.BrandName AS BrandName,
                COUNT(*) AS TotalRows,
                SUM(SD.G1) AS TotalG1,
                SUM(SD.G2) AS TotalG2,
                SUM(SD.G3) AS TotalG3,
                SUM(SD.G4) AS TotalG4,
                SUM(SD.AOQ1) AS TotalAOQ1,
                SUM(SD.AOQ2) AS TotalAOQ2,
                SUM(SD.AOQ3) AS TotalAOQ3,
                SUM(SD.AOQ4) AS TotalAOQ4
            FROM 
              [csstock].[dbo].[SubDesign] SD
                INNER JOIN [csstock].[dbo].[DesignName] DN ON SD.GenCode = DN.GenCode
                INNER JOIN [csstock].[dbo].[BrandName] BN ON DN.BrandCode = BN.BrandCode
                INNER JOIN [csstock].[dbo].[Batch] BT ON SD.BtCode = BT.BtCode
            WHERE
                SD.GenCode = :gencode
                AND BT.BtName <> 'ZX'
            GROUP BY BN.BrandName;
        `;

    const stockResults = await sequelize.query(stockQuery, {
      replacements: { gencode },
      type: sequelize.QueryTypes.SELECT,
    });

    // Second Query: Fetch Shade-wise Box Pack Summary
    const boxPackQuery = `
            SELECT
                SH.ShName,
                SUM(SD.G1) AS SumG1,
                SUM(SD.G2) AS SumG2,
                SUM(SD.G3) AS SumG3,
                SUM(SD.G4) AS SumG4,
                SUM(SD.Gtot) AS SumGtot,
                SUM(SD.AOQ1) AS SumAOQ1,
                SUM(SD.AOQ2) AS SumAOQ2,
                SUM(SD.AOQ3) AS SumAOQ3,
                SUM(SD.AOQ4) AS SumAOQ4,
                SUM(SD.AOQtot) AS SumAOQtot
            FROM 
                [csstock].[dbo].[SubDesign] SD
                INNER JOIN [csstock].[dbo].[DesignName] DN ON SD.GenCode = DN.GenCode
                INNER JOIN [csstock].[dbo].[BrandName] BN ON DN.BrandCode = BN.BrandCode
                INNER JOIN [csstock].[dbo].[Shade] SH ON SD.ShCode = SH.ShCode
                INNER JOIN [csstock].[dbo].[Batch] BT ON SD.BtCode = BT.BtCode
            WHERE
                SD.GenCode = :gencode
                AND BT.BtName <> 'ZX'
            GROUP BY SH.ShName
            ORDER BY SH.ShName;
        `;

    const boxResults = await sequelize.query(boxPackQuery, {
      replacements: { gencode },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: stockResults.length,
      data: stockResults,
      boxResults,
    });
  } catch (error) {
    console.error("Error fetching stock details:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const stockDetailsWithBatchAndManufacturing = async (req, res) => {
  try {
    const { gencode, shname } = req.params;
    const sequelize = req.sequelize;

    const query = `
           SELECT 
    Batch.BtName,
    MfgStatus.MsName,
    SUM(SubDesign.G1)      AS SumG1,
    SUM(SubDesign.G2)      AS SumG2,
    SUM(SubDesign.G3)      AS SumG3,
    SUM(SubDesign.G4)      AS SumG4,
    SUM(SubDesign.Gtot)    AS SumGtot,     -- if needed
    SUM(SubDesign.AOQ1)    AS SumAOQ1,
    SUM(SubDesign.AOQ2)    AS SumAOQ2,
    SUM(SubDesign.AOQ3)    AS SumAOQ3,
    SUM(SubDesign.AOQ4)    AS SumAOQ4,
    SUM(SubDesign.AOQtot)  AS SumAOQtot    -- if needed
FROM 
    (
        (
            (
                (
                    BrandName
                    INNER JOIN 
                        (
                            SubDesign
                            INNER JOIN DesignName 
                                ON SubDesign.GenCode = DesignName.GenCode
                        )
                    ON BrandName.BrandCode = DesignName.BrandCode
                )
                INNER JOIN Shade 
                    ON SubDesign.ShCode = Shade.ShCode
            )
            INNER JOIN LocName 
                ON SubDesign.LcCode = LocName.LcCode
        )
        INNER JOIN MfgStatus 
            ON SubDesign.MsCode = MfgStatus.MsCode
    )
    INNER JOIN Batch 
        ON SubDesign.BtCode = Batch.BtCode
WHERE
      SubDesign.GenCode  = :gencode
  AND Shade.ShName       = :shname   -- passed from API #1
  AND Batch.BtName      <> 'ZX'
GROUP BY
    Batch.BtName,
    MfgStatus.MsName
ORDER BY
    Batch.BtName,
    MfgStatus.MsName;
        `;

    const results = await sequelize.query(query, {
      replacements: { gencode, shname },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

// sename details like name total_order not_ready,half,ready
export const seNameDetails = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const { search, page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    // Get total record count
    let totalRecordQuery = `
        SELECT COUNT(DISTINCT SEName.SEName) AS totalRecord
        FROM [csstock].[dbo].[OrdMast]
        INNER JOIN [csstock].[dbo].[CustName] ON OrdMast.CCode = CustName.CCode
        INNER JOIN [csstock].[dbo].[SEName] ON CustName.SECode = SEName.SECode
    `;

    if (search) {
      totalRecordQuery += ` WHERE SEName.SEName LIKE :search `;
    }

    const totalRecordResult = await sequelize.query(totalRecordQuery, {
      replacements: {
        search: `%${search}%`,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    const totalRecord = totalRecordResult[0]?.totalRecord || 0;
    const totalPage = Math.ceil(totalRecord / limit);

    // Main query with pagination
    let query = `
        SELECT 
            SEName.SEName,
            COUNT(OrdMast.OrdNo) AS TotalOrderCount,
            SUM(OrdMast.CTotQty) AS TotalOrderQty,
            SUM(CASE WHEN OrdMast.OStatus = 'Ready' THEN 1 ELSE 0 END) AS ReadyOrderCount,
            SUM(CASE WHEN OrdMast.OStatus = 'Ready' THEN OrdMast.CTotQty ELSE 0 END) AS ReadyOrderQty,
            SUM(CASE WHEN OrdMast.OStatus = 'HalfReady' THEN 1 ELSE 0 END) AS HalfReadyOrderCount,
            SUM(CASE WHEN OrdMast.OStatus = 'HalfReady' THEN OrdMast.CTotQty ELSE 0 END) AS HalfReadyOrderQty,
            SUM(CASE WHEN OrdMast.OStatus = 'NotReady' THEN 1 ELSE 0 END) AS NotReadyOrderCount,
            SUM(CASE WHEN OrdMast.OStatus = 'NotReady' THEN OrdMast.CTotQty ELSE 0 END) AS NotReadyOrderQty
        FROM 
            [csstock].[dbo].[OrdMast]
            INNER JOIN [csstock].[dbo].[CustName] ON OrdMast.CCode = CustName.CCode
            INNER JOIN [csstock].[dbo].[SEName] ON CustName.SECode = SEName.SECode
    `;

    if (search) {
      query += ` WHERE SEName.SEName LIKE :search `;
    }

    query += `
        GROUP BY SEName.SEName
        ORDER BY SEName.SEName
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
    `;

    const results = await sequelize.query(query, {
      replacements: {
        search: `%${search}%`,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      totalRecord,
      totalPage,
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const getOrderFilterDetails = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    // Handle query params as arrays or default to empty arrays
    let {
      city,
      PlaceState,
      OType,
      OCName,
      OACode,
      OdateFrom,
      OdateTo,
      PLdateFrom,
      PLdateTo,
      TrType,
      GroupCode,
      LevelCode,
      search,
      page = 1,
      limit = 10,
    } = req.body;

    const offset = (page - 1) * limit;

    // Convert query params to arrays where necessary
    city = city ? (Array.isArray(city) ? city : [city]) : [];
    PlaceState = PlaceState
      ? Array.isArray(PlaceState)
        ? PlaceState
        : [PlaceState]
      : [];
    OType = OType ? (Array.isArray(OType) ? OType : [OType]) : [];
    OCName = OCName ? (Array.isArray(OCName) ? OCName : [OCName]) : [];
    OACode = OACode ? (Array.isArray(OACode) ? OACode : [OACode]) : [];
    TrType = TrType ? (Array.isArray(TrType) ? TrType : [TrType]) : [];
    GroupCode = GroupCode
      ? Array.isArray(GroupCode)
        ? GroupCode
        : [GroupCode]
      : [];
    LevelCode = LevelCode
      ? Array.isArray(LevelCode)
        ? LevelCode
        : [LevelCode]
      : [];

    // Start building the query
    let query = `
      SELECT DISTINCT om.*, oa.*, cn.*, gn.*, ln.*
      FROM [csstock].[dbo].[OrdMast] om
      LEFT JOIN [csstock].[dbo].[OAction] oa
        ON om.OACode = oa.OACode
      LEFT JOIN [csstock].[dbo].[CustName] cn
        ON cn.CCode = om.CCode
      LEFT JOIN [csstock].[dbo].[GroupName] gn
        ON cn.GrpCode = gn.GrpCode
      LEFT JOIN [csstock].[dbo].[LevelName] ln
        ON cn.LevelCode = ln.LevelCode 
    `;

    let conditions = [];
    let replacements = {};

    // Filter conditions
    if (city.length > 0) {
      conditions.push(`om.OCity IN (:city)`);
      replacements.city = city;
    }
    if (PlaceState.length > 0) {
      conditions.push(`om.PlaceState IN (:PlaceState)`);
      replacements.PlaceState = PlaceState;
    }
    if (OType.length > 0) {
      conditions.push(`om.OType IN (:OType)`);
      replacements.OType = OType;
    }
    if (OCName.length > 0) {
      conditions.push(`om.OCName IN (:OCName)`);
      replacements.OCName = OCName;
    }
    if (OACode.length > 0) {
      conditions.push(`om.OACode IN (:OACode)`);
      replacements.OACode = OACode;
    }
    if (OdateFrom) {
      conditions.push(`om.Odate >= :OdateFrom`);
      replacements.OdateFrom = OdateFrom;
    }
    if (OdateTo) {
      conditions.push(`om.Odate <= :OdateTo`);
      replacements.OdateTo = OdateTo;
    }
    if (PLdateFrom) {
      conditions.push(`TRY_CAST(om.PLdate AS datetime) >= :PLdateFrom`);
      replacements.PLdateFrom = PLdateFrom;
    }
    if (PLdateTo) {
      conditions.push(`TRY_CAST(om.PLdate AS datetime) <= :PLdateTo`);
      replacements.PLdateTo = PLdateTo;
    }
    if (TrType.length > 0) {
      conditions.push(`om.TrType IN (:TrType)`);
      replacements.TrType = TrType;
    }
    if (GroupCode.length > 0) {
      conditions.push(`gn.GrpCode IN (:GroupCode)`);
      replacements.GroupCode = GroupCode;
    }
    if (LevelCode.length > 0) {
      conditions.push(`ln.LevelCode IN (:LevelCode)`);
      replacements.LevelCode = LevelCode;
    }

    // Search filter (if provided)
    if (search) {
      conditions.push(`(
        om.OACode LIKE :search OR
        cn.CName LIKE :search OR
        gn.GrpName LIKE :search OR
        ln.LevelName LIKE :search
      )`);
      replacements.search = `%${search}%`;
    }

    // Add WHERE clause if any conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    // Order results by order date in descending order
    query += ` ORDER BY om.Odate DESC`;

    // Add pagination
    query += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;

    replacements.offset = offset;
    replacements.limit = parseInt(limit);

    // Execute the query using sequelize
    const responseData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    });

    // Get total count for pagination info
    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM [csstock].[dbo].[OrdMast] om
      LEFT JOIN [csstock].[dbo].[OAction] oa
        ON om.OACode = oa.OACode
      LEFT JOIN [csstock].[dbo].[CustName] cn
        ON cn.CCode = om.CCode
      LEFT JOIN [csstock].[dbo].[GroupName] gn
        ON cn.GrpCode = gn.GrpCode
      LEFT JOIN [csstock].[dbo].[LevelName] ln
        ON cn.LevelCode = ln.LevelCode
      ${conditions.length > 0 ? `WHERE ` + conditions.join(" AND ") : ""}
    `;

    const totalCountResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements,
    });
    const totalCount = totalCountResult[0]?.totalCount || 0;

    // Return the response
    res.status(200).json({
      status: 200,
      success: true,
      totalRecords: totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      limit,
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    // Handle any errors and return a 500 response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// get all order
export const getOrderDetails = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const { search, page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    // Get total record count first
    let totalRecordQuery = `
        SELECT COUNT(DISTINCT OrdMast.OrdNo) AS totalRecord
        FROM [csstock].[dbo].[OrdMast]
        INNER JOIN [csstock].[dbo].[CustName] ON OrdMast.CCode = CustName.CCode
        INNER JOIN [csstock].[dbo].[SEName] ON CustName.SECode = SEName.SECode
        INNER JOIN [csstock].[dbo].[OrdSubItem] ON OrdMast.OrdNo = OrdSubItem.OrdNo
        INNER JOIN [csstock].[dbo].[SubDesign] ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
    `;

    if (search) {
      totalRecordQuery += ` WHERE OrdMast.OCName LIKE :search `;
    }

    const totalRecordResult = await sequelize.query(totalRecordQuery, {
      replacements: {
        search: `%${search}%`,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    const totalRecord = totalRecordResult[0]?.totalRecord || 0;
    const totalPage = Math.ceil(totalRecord / limit);

    let orderQuery = `
        SELECT 
            OrdMast.OrdNo,
            OrdMast.Odate,
            MIN(OrdMast.OCName) AS OCName,
            MIN(OrdMast.OCity) AS OCity,
            MIN(OrdMast.PlaceState) AS PlaceState,
            MIN(OrdMast.Pline) AS Pline,
            MIN(OrdMast.OStatus) AS OStatus,
            MIN(SEName.SEName) AS SEName,
            SUM(OrdSubItem.G1) AS G1,
            SUM(OrdSubItem.G2) AS G2,
            SUM(OrdSubItem.G3) AS G3,
            SUM(OrdSubItem.G4) AS G4
        FROM [csstock].[dbo].[OrdMast]
        INNER JOIN [csstock].[dbo].[CustName] ON OrdMast.CCode = CustName.CCode
        INNER JOIN [csstock].[dbo].[SEName] ON CustName.SECode = SEName.SECode
        INNER JOIN [csstock].[dbo].[OrdSubItem] ON OrdMast.OrdNo = OrdSubItem.OrdNo
        INNER JOIN [csstock].[dbo].[SubDesign] ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
    `;

    if (search) {
      orderQuery += ` WHERE OrdMast.OCName LIKE :search `;
    }

    orderQuery += `
        GROUP BY OrdMast.OrdNo, OrdMast.Odate
        ORDER BY OrdMast.Odate DESC
        OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
    `;

    const orders = await sequelize.query(orderQuery, {
      replacements: {
        search: `%${search}%`,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (!orders.length) {
      return res.status(200).json({
        status: 200,
        success: true,
        totalRecord,
        totalPage,
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10),
        data: [],
      });
    }

    const orderNos = orders.map((order) => order.OrdNo);
    const orderNosStr = orderNos.join(",");

    const orderCountsQuery = `
        SELECT 
            OrdNo, 
            SUM(CTotQty) AS TotalQty, 
            SUM(Cwt) AS TotalWeight, 
            SUM(RdTotQty) AS ReadyQty, 
            SUM(Rdwt) AS ReadyWeight, 
            SUM(NRdTotQty) AS NotReadyQty, 
            SUM(NRdwt) AS NotReadyWeight
        FROM [csstock].[dbo].[OrdMast]
        WHERE OrdNo IN (${orderNosStr})
        GROUP BY OrdNo;
    `;

    const R_NR_Query = `
        SELECT 
            OrdSubItem.OrdNo, 
            OrdSubItem.OrdCN, 
            COUNT(*) AS RecordCount
        FROM [csstock].[dbo].[OrdSubItem] 
        WHERE OrdSubItem.OrdNo IN (${orderNosStr})
        GROUP BY OrdSubItem.OrdNo, OrdSubItem.OrdCN;
    `;

    const orderCounts = await sequelize.query(orderCountsQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    const R_NR_Results = await sequelize.query(R_NR_Query, {
      type: sequelize.QueryTypes.SELECT,
    });

    const orderCountsMap = Object.fromEntries(
      orderCounts.map((item) => [item.OrdNo, item])
    );
    const readyMap = new Map();
    const notReadyMap = new Map();

    R_NR_Results.forEach((item) => {
      if (item.OrdCN === 0) {
        readyMap.set(item.OrdNo, item.RecordCount);
      } else {
        notReadyMap.set(item.OrdNo, item.RecordCount);
      }
    });

    // Grouping records by `Odate`
    const groupedData = {};
    orders.forEach((order) => {
      const counts = orderCountsMap[order.OrdNo] || {};
      const orderData = {
        OrdNo: order.OrdNo,
        Odate: order.Odate,
        OCName: order.OCName,
        OCity: order.OCity,
        PlaceState: order.PlaceState,
        Pline: order.Pline,
        OStatus: order.OStatus,
        SEName: order.SEName,
        G1: order.G1 || 0,
        G2: order.G2 || 0,
        G3: order.G3 || 0,
        G4: order.G4 || 0,
        TotalQty: counts.TotalQty || 0,
        TotalWeight: counts.TotalWeight || 0,
        ReadyQty: counts.ReadyQty || 0,
        ReadyWeight: counts.ReadyWeight || 0,
        NotReadyQty: counts.NotReadyQty || 0,
        NotReadyWeight: counts.NotReadyWeight || 0,
        Ready: readyMap.get(order.OrdNo) || 0,
        NotReady: notReadyMap.get(order.OrdNo) || 0,
        Total:
          (readyMap.get(order.OrdNo) || 0) +
          (notReadyMap.get(order.OrdNo) || 0),
      };

      if (!groupedData[order.Odate]) {
        groupedData[order.Odate] = {
          Odate: order.Odate,
          records: [],
        };
      }
      groupedData[order.Odate].records.push(orderData);
    });

    const responseData = Object.values(groupedData);

    res.status(200).json({
      status: 200,
      success: true,
      totalRecord,
      currentPage: parseInt(page, 10),
      totalPage,
      limit: parseInt(limit, 10),
      data: responseData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

//get order by order id
export const getOrderDetailsByID = async (req, res) => {
  try {
    const { ordNo } = req.params;
    const sequelize = req.sequelize;

    const query = `
                    SELECT 
    OrdMast.OrdNo, 
    OrdMast.OCName, 
    OrdMast.OCity, 
    OrdMast.PlaceState, 
    OrdMast.Odate, 
    OrdMast.POno, 
    OrdMast.PODate, 
    SEName.SEName, 
    OrdMast.ORem1, 
    OrdMast.PLdate, 
    RefName.RefName, 
    OrdMast.Deldate, 
    AreaName.AreaName, 
    LevelName.LevelName, 
    OrdMast.LRno, 
    OrdMast.TruckNo, 
    TrptName.TrptName
FROM 
    OrdMast
INNER JOIN 
    CustName ON OrdMast.CCode = CustName.CCode
INNER JOIN 
    SEName ON CustName.SECode = SEName.SECode
INNER JOIN 
    RefName ON CustName.RefCode = RefName.RefCode
INNER JOIN 
    AreaName ON CustName.AreaCode = AreaName.AreaCode
INNER JOIN 
    LevelName ON CustName.LevelCode = LevelName.LevelCode
INNER JOIN 
    TrptName ON OrdMast.TrptCode = TrptName.TrptCode
WHERE 
    OrdMast.OrdNo = :ordNo;
        `;

    const results = await sequelize.query(query, {
      replacements: { ordNo },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};

// get order by id total,not_ready,ready
export const getTotalOrderCount_By_OrderID = async (req, res) => {
  try {
    const { ordNo } = req.params;
    const sequelize = req.sequelize;

    // Query to count ready (OrdCN = 0) and not ready (OrdCN = 1) orders
    const countQuery = `
            SELECT 
                OrdSubItem.OrdNo, 
                SubDesign.GenCode, 
                OrdSubItem.Pfcode,
                SUM(CASE WHEN OrdSubItem.OrdCN = 0 THEN 1 ELSE 0 END) AS ReadyCount,
                SUM(CASE WHEN OrdSubItem.OrdCN = 1 THEN 1 ELSE 0 END) AS NotReadyCount
            FROM OrdSubItem
            INNER JOIN SubDesign ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
            WHERE OrdSubItem.OrdNo = :ordNo
            GROUP BY OrdSubItem.OrdNo, SubDesign.GenCode, OrdSubItem.Pfcode;
        `;

    // Query to get order details
    const orderQuery = `
            SELECT 
                OrdMast.OrdNo, 
                SUM(OrdMast.CTotQty) AS TotalQty, 
                SUM(OrdMast.Cwt) AS TotalWeight, 
                SUM(OrdMast.RdTotQty) AS ReadyQty, 
                SUM(OrdMast.Rdwt) AS ReadyWeight, 
                SUM(OrdMast.NRdTotQty) AS NotReadyQty, 
                SUM(OrdMast.NRdwt) AS NotReadyWeight
            FROM OrdMast
            WHERE OrdMast.OrdNo = :ordNo
            GROUP BY OrdMast.OrdNo;
        `;

    // Execute both queries in parallel
    const [countResults, orderResults] = await Promise.all([
      sequelize.query(countQuery, {
        replacements: { ordNo },
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(orderQuery, {
        replacements: { ordNo },
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    // Prepare response
    if (!orderResults.length) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "Order not found" });
    }

    const orderData = orderResults[0];
    orderData.Ready = countResults.reduce(
      (sum, row) => sum + row.ReadyCount,
      0
    );
    orderData.NReady = countResults.reduce(
      (sum, row) => sum + row.NotReadyCount,
      0
    );
    orderData.Total = orderData.Ready + orderData.NReady;

    res
      .status(200)
      .json({ status: 200, success: true, count: 1, data: orderData });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

// get order description by order id
export const getOrderDescriptionByID = async (req, res) => {
  try {
    const { ordNo } = req.params;
    const sequelize = req.sequelize;

    const query = `
            SELECT
            OrdSubItem.OrdNo, 
            OrdSubItem.OrdCN, 
            SubDesign.GenCode, 
            SubDesign.BtBoxWt,
            PrdtName.PrdtName, 
            BrandName.BrandName, 
            SizeName.SizeName, 
            CatName.CatName, 
            DesignName.DesignName, 
            PackFor.PfName, 
            Shade.ShName, 
            Batch.BtName, 
            MfgStatus.MsName, 
            SUM(OrdSubItem.G1) AS SumOfG1, 
            SUM(OrdSubItem.G2) AS SumOfG2, 
            SUM(OrdSubItem.G3) AS SumOfG3, 
            SUM(OrdSubItem.G4) AS SumOfG4,
            SUM(OrdSubItem.Gtot) AS SumOfGtot
        FROM 
            OrdSubItem
            INNER JOIN SubDesign ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
            INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
            INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
            INNER JOIN PackFor ON OrdSubItem.PfCode = PackFor.PfCode
            INNER JOIN Batch ON SubDesign.BtCode = Batch.BtCode
            INNER JOIN MfgStatus ON SubDesign.MsCode = MfgStatus.MsCode
            INNER JOIN PrdtName ON DesignName.PrdtCode = PrdtName.PrdtCode
            INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode
            INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode
            INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
        WHERE 
            OrdSubItem.OrdNo = :ordNo
        GROUP BY 
            OrdSubItem.OrdNo, 
            SubDesign.GenCode, 
            SubDesign.BtBoxWt,
            OrdSubItem.OrdCN,
            PrdtName.PrdtName, 
            BrandName.BrandName, 
            SizeName.SizeName, 
            CatName.CatName, 
            DesignName.DesignName, 
            PackFor.PfName, 
            Shade.ShName, 
            Batch.BtName, 
            MfgStatus.MsName;
        `;
    const results = await sequelize.query(query, {
      replacements: { ordNo },
      type: sequelize.QueryTypes.SELECT,
    });
    const groupedData = {};

    results.forEach((item) => {
      const key = `${item.SizeName}_${item.CatName}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          SizeName: item.SizeName,
          CatName: item.CatName,
          records: [],
          TotalQuntity: 0,
          TotalWeight: 0,
        };
      }

      groupedData[key].records.push(item);
      groupedData[key].TotalQuntity += item.SumOfGtot;
      groupedData[key].TotalWeight += item.BtBoxWt;
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: Object.keys(groupedData).length,
      data: Object.values(groupedData),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: error.message });
  }
};
// get total stock count
/* export const getTotalStockCount = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const todayDate = new Date().toISOString().split("T")[0];

    const queries = {
      todayOrder: `SELECT SUM(RTotQty) AS total_orders FROM OrdMast where Odate = ?`,
      bookingStock: `SELECT Sum(OrdSubItem.Gtot) AS booking_stock FROM OrdSubItem WHERE OrdSubItem.OrdCN = 0`,
      totalStock: `SELECT Sum(SubDesign.Gtot) AS total_stock FROM SubDesign`,
    };

    const [
      [{ total_stock = 0 }],
      [{ booking_stock = 0 }],
      [{ total_orders = 0 }],
    ] = await Promise.all([
      sequelize.query(queries.totalStock, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(queries.bookingStock, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(queries.todayOrder, {
        replacements: [todayDate],
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      total_stock: Number(total_stock),
      booking_stock: Number(booking_stock),
      after_order_stock: Number(total_stock) - Number(booking_stock),
      today_orders: Number(total_orders),
    });
  } catch (error) {
    console.error(`Error fetching stock count: ${error.message}`, error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}; */

export const getTotalStockCount = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const todayDate = new Date().toISOString().split("T")[0];

    const queries = {
      todayOrder: `SELECT SUM(RTotQty) AS total_orders FROM [csstock].[dbo].[OrdMast] WHERE Odate = ?`,
      bookingStock: `SELECT SUM([csstock].[dbo].[OrdSubItem].Gtot) AS booking_stock FROM [csstock].[dbo].[OrdSubItem] WHERE OrdSubItem.OrdCN = 0`,
      totalStock: `SELECT SUM([csstock].[dbo].[SubDesign].Gtot) AS total_stock FROM [csstock].[dbo].[SubDesign]`,
    };

    const [
      [{ total_stock = 0 }],
      [{ booking_stock = 0 }],
      [{ total_orders = 0 }],
    ] = await Promise.all([
      sequelize.query(queries.totalStock, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(queries.bookingStock, {
        type: sequelize.QueryTypes.SELECT,
      }),
      sequelize.query(queries.todayOrder, {
        replacements: [todayDate],
        type: sequelize.QueryTypes.SELECT,
      }),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      total_stock: Number(total_stock),
      booking_stock: Number(booking_stock),
      after_order_stock: Number(total_stock) - Number(booking_stock),
      today_orders: Number(total_orders),
    });
  } catch (error) {
    console.error(`Error fetching stock count: ${error.message}`, error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// get all order count
export const getAllOrderTotalCount = async (req, res) => {
  try {
    const sequelize = req.sequelize;

    const query = `
            SELECT 
                COUNT(O.OrdNo) AS TotalOrderCount,
                SUM(O.CTotQty) AS TotalOrderQty,
                SUM(CASE WHEN O.OStatus = 'Ready' THEN 1 ELSE 0 END) AS ReadyOrderCount,
                SUM(CASE WHEN O.OStatus = 'Ready' THEN O.CTotQty ELSE 0 END) AS ReadyOrderQty,
                SUM(CASE WHEN O.OStatus = 'HalfReady' THEN 1 ELSE 0 END) AS HalfReadyOrderCount,
                SUM(CASE WHEN O.OStatus = 'HalfReady' THEN O.CTotQty ELSE 0 END) AS HalfReadyOrderQty,
                SUM(CASE WHEN O.OStatus = 'NotReady' THEN 1 ELSE 0 END) AS NotReadyOrderCount,
                SUM(CASE WHEN O.OStatus = 'NotReady' THEN O.CTotQty ELSE 0 END) AS NotReadyOrderQty
            FROM OrdMast O
            INNER JOIN CustName C ON O.CCode = C.CCode
            INNER JOIN SEName S ON C.SECode = S.SECode
        `;

    const [results] = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching order count:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

// get order details by Gencode, Btcode, shcode, mscode
export const getOrderDetailsByGencode_Btcode_Shcode_MsCode = async (
  req,
  res
) => {
  try {
    const { gencode, btcode, shcode, mscode } = req.params;
    const sequelize = req.sequelize;

    const query = `
        SELECT 
          o.OrdNo,
          MIN(o.Odate) AS Odate,
          MIN(o.OCName) AS OCName,
          MIN(o.OCity) AS OCity,
          MIN(o.PlaceState) AS PlaceState,
          MIN(o.Pline) AS Pline,
          MIN(o.OStatus) AS OStatus,
          MIN(s.SEName) AS SEName,
          SUM(oi.G1) AS G1,
          SUM(oi.G2) AS G2,
          SUM(oi.G3) AS G3,
          SUM(oi.G4) AS G4
        FROM OrdMast o
        INNER JOIN CustName cn ON o.CCode = cn.CCode
        INNER JOIN SEName s ON cn.SECode = s.SECode
        INNER JOIN OrdSubItem oi ON o.OrdNo = oi.OrdNo
        INNER JOIN SubDesign sd ON oi.GenSrNo = sd.GenSrNo
        WHERE sd.GenCode = :gencode
          AND sd.BtCode = :btcode
          AND sd.ShCode = :shcode
          AND sd.MsCode = :mscode
        GROUP BY o.OrdNo;
      `;

    const results = await sequelize.query(query, {
      replacements: { gencode, btcode, shcode, mscode },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrderDetailsByGencode_pfname = async (req, res) => {
  try {
    const { gencode, pfname } = req.params;
    const sequelize = req.sequelize;

    const query = `
        SELECT 
            OrdMast.OrdNo,
            MIN(OrdMast.Odate) AS FirstOfOdate,
            MIN(OrdMast.OCName) AS FirstOfOCName,
            MIN(OrdMast.OCity) AS FirstOfOCity,
            MIN(OrdMast.PlaceState) AS FirstOfPlaceState,
            MIN(OrdMast.Pline) AS FirstOfPline,
            MIN(OrdMast.OStatus) AS FirstOfOStatus,
            MIN(SEName.SEName) AS FirstOfSEName,
            SUM(CTotQty) AS TotalQty,
            SUM(Cwt) AS TotalWeight,
            SUM(RdTotQty) AS ReadyQty,
            SUM(Rdwt) AS ReadyWeight,
            SUM(NRdTotQty) AS NotReadyQty,
            SUM(NRdwt) AS NotReadyWeight,
            Batch.BtName,
            Shade.ShName,
            MfgStatus.MsName,
            PackFor.PfName,
            SUM(OrdSubItem.G1) AS SumOfG1,
            SUM(OrdSubItem.G2) AS SumOfG2,
            SUM(OrdSubItem.G3) AS SumOfG3,
            SUM(OrdSubItem.G4) AS SumOfG4,
            SUM(OrdSubItem.Gtot) AS SumOfGtot,
            OrdSubItem.OrdCN
        FROM 
            SEName 
            INNER JOIN CustName ON SEName.SECode = CustName.SECode
            INNER JOIN OrdMast ON CustName.CCode = OrdMast.CCode
            INNER JOIN OrdSubItem ON OrdMast.OrdNo = OrdSubItem.OrdNo
            INNER JOIN SubDesign ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
            INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
            INNER JOIN Batch ON SubDesign.BtCode = Batch.BtCode
            INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
            INNER JOIN MfgStatus ON SubDesign.MsCode = MfgStatus.MsCode
            INNER JOIN PackFor ON OrdSubItem.PfCode = PackFor.PfCode
        WHERE 
            SubDesign.GENCODE = :gencode 
            AND packfor.pfname = :pfname
        GROUP BY 
            OrdMast.OrdNo,
            Batch.BtName,
            Shade.ShName,
            MfgStatus.MsName,
            PackFor.PfName,
            OrdSubItem.OrdCN
        ORDER BY 
            FirstOfOdate DESC;
        `;

    const results = await sequelize.query(query, {
      replacements: { gencode, pfname },
      type: sequelize.QueryTypes.SELECT,
    });

    const Ready = [];
    const NotReady = [];

    for (let order of results) {
      const orderQuery = `
            SELECT 
                OrdSubItem.OrdNo, 
                SubDesign.GenCode, 
                OrdSubItem.Pfcode,
                SUM(CASE WHEN OrdSubItem.OrdCN = 0 THEN 1 ELSE 0 END) AS ReadyCount,
                SUM(CASE WHEN OrdSubItem.OrdCN = 1 THEN 1 ELSE 0 END) AS NotReadyCount
            FROM OrdSubItem
            INNER JOIN SubDesign ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
            WHERE OrdSubItem.OrdNo = :ordNo
            GROUP BY OrdSubItem.OrdNo, SubDesign.GenCode, OrdSubItem.Pfcode;
            `;

      // Execute the second query for each order
      const orderDetails = await sequelize.query(orderQuery, {
        replacements: { ordNo: order.OrdNo },
        type: sequelize.QueryTypes.SELECT,
      });

      order.ReadyCount = orderDetails.reduce(
        (sum, row) => sum + row.ReadyCount,
        0
      );
      order.NotReadyCount = orderDetails.reduce(
        (sum, row) => sum + row.NotReadyCount,
        0
      );
      order.TotalCount = order.ReadyCount + order.NotReadyCount;

      if (order.OrdCN === 0) {
        Ready.push(order);
      } else if (order.OrdCN === 1) {
        NotReady.push(order);
      }
    }

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: {
        Ready,
        NotReady,
      },
    });
  } catch (error) {
    console.log("Error fetching order details: ", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

  return `${day}/${month}/${year} ${String(hours).padStart(
    2,
    "0"
  )}:${minutes}:${seconds} ${ampm}`;
}

export const PlaceOrder = async (req, res) => {
  try {
    const sequelize = req.sequelize;
    const { orderDetails } = req.body;
    const result = await validationOrder({ orderDetails });
    const formattedDate = formatDate(new Date());
    if (!result.success) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "",
        errors: result.error,
      });
    }

    for (let index = 0; index < orderDetails.length; index++) {
      let lastRecordQuery = `SELECT TOP 1 NOrdNo FROM NOrdMast ORDER BY NOrdNo DESC;`;
      const [lastRecordQueryResults] = await sequelize.query(lastRecordQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      let RTotQty = 0;
      for (
        let Gindex = 0;
        Gindex < orderDetails[index].orders.length;
        Gindex++
      ) {
        let grquery = `select GrCode from GrName where GrName = '${orderDetails[index].orders[Gindex].grName}';`;
        const [grResults] = await sequelize.query(grquery, {
          type: sequelize.QueryTypes.SELECT,
        });

        const OItemQuery = `INSERT INTO NOrdItem (
                                    NOrdNo, OSrNo, GenCode, G1, G2, G3, G4, G5, Gtot, 
                                    M1, M2, M3, M4, M5, R1, R2, R3, R4, R5, 
                                    EntDt, PLMark, PLSrNo, PLdate, Mark, NOrdDesc, PfCode
                                ) VALUES (
                                    ${lastRecordQueryResults.NOrdNo + 1}, 1, ${
          orderDetails[index].gencode
        }, ${
          grResults.GrCode === 1
            ? orderDetails[index].orders[Gindex].quantity
            : 0.0
        }, ${
          grResults.GrCode === 2
            ? orderDetails[index].orders[Gindex].quantity
            : 0
        }, ${
          grResults.GrCode === 3
            ? orderDetails[index].orders[Gindex].quantity
            : 0
        }, ${
          grResults.GrCode === 4
            ? orderDetails[index].orders[Gindex].quantity
            : 0
        }, ${
          grResults.GrCode === 5
            ? orderDetails[index].orders[Gindex].quantity
            : 0
        },
                                     ${
                                       orderDetails[index].orders[Gindex]
                                         .quantity
                                     }, 
                                    0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 
                                    0, '-', 0,'','', '', ${
                                      orderDetails[index].shcode
                                    } 
                                );
                            `;
        await sequelize.query(OItemQuery, {
          type: sequelize.QueryTypes.INSERT,
        });

        RTotQty = RTotQty + orderDetails[index].orders[Gindex].quantity;
      }
      let custDetails = `select CName,CCtName,CCode,StName from CustName where CCode=${orderDetails[index].ccode}`;
      const [custDetailsResults] = await sequelize.query(custDetails, {
        type: sequelize.QueryTypes.SELECT,
      });

      let nOrderMast = `INSERT INTO NOrdMast (
                    NOrdNo, OrdNoC, Odate, OdateC, TrType, TrMtd, OType, OStatus, 
                    OACode, CCode, OCName, OCity, TrptCode, DCCode, Tranno, PlaceState, 
                    TaxNo, POno, InvNo, TruckNo, LRno, PODate, RTotQty, Rwt, CTotQty, Cwt, 
                    RdTotQty, Rdwt, NRdTotQty, NRdwt, Deldate, PLMark, PLSrNo, PLdate, 
                    PriNo, ORem1, ORem2, UID, UDTTM, Mark, ActOrd, Sel1, Sel2, SBCode
        )
        VALUES (
            ${lastRecordQueryResults.NOrdNo + 1}, '', '${
        new Date().toISOString().split("T")[0]
      }', '${new Date()
        .toISOString()
        .split("T")[0]
        .split("-")
        .join("")}', 'ENTRY', 'NOTING', 'P', 'NotReady', 
            1, ${orderDetails[index].ccode}, '${custDetailsResults.CName}', '${
        custDetailsResults.CCtName
      }', 1, 1, 0, '${custDetailsResults.StName}', 
            0, '', '', '', '', '__/__/____', ${RTotQty}, 0, 0.00, 0.00, 
            0.00, 0.00, 0.00, 0.00, '_/__/____', '-', 0, '', 0, '${
              orderDetails[index].orm
            }', '', 
            1, '${formattedDate}', '', 0, '', '', 1
        );`;

      await sequelize.query(nOrderMast, {
        type: sequelize.QueryTypes.INSERT,
      });
    }

    res.status(201).json({
      status: 201,
      success: true,
      message: "Order Place successfully",
      data: {},
    });
  } catch (error) {
    console.log("Error cart order: ", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

/* export const AddToCart = async (req, res) => {
  try {
    req.sequelize = await authDbConnection();

    // console.log("req.sequelize:", req.sequelize);

    const { gencode, shcode, ccode, orders, orm, user_id } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Orders must be a non-empty array",
      });
    }

    // ✅ Use a proper validation function (Zod or similar)
    const validationResult = await validationOrderCart({
      gencode,
      shcode,
      ccode,
      orders,
      orm,
      user_id,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Failed",
        errors: validationResult.error,
      });
    }

    // ✅ Build bulk insert query dynamically
    const values = orders
      .map(
        (order) =>
          `(:gencode, :shcode, :ccode, '${order.grName}', ${order.quantity}, :orm, :user_id)`
      )
      .join(", ");

    // ✅ Insert multiple rows using sequelize.query
    const [result] = await req.sequelize.query(
      `INSERT INTO [csstock].[dbo].[ordCart] (gencode, shcode, ccode, grName, quantity, orm, userId) 
         OUTPUT INSERTED.*  
         VALUES ${values}`,
      {
        replacements: { gencode, shcode, ccode, orm, user_id },
        type: req.sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      status: 201,
      success: true,
      message: "Items added to cart successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error cart order:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}; */

// NEW AddToCart
export const AddToCart = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    const { gencode, shcode, ccode, orders, orm, user_id } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Orders must be a non-empty array",
      });
    }

    // ✅ Use a proper validation function (Zod or similar)
    const validationResult = await validationOrderCart({
      gencode,
      shcode,
      ccode,
      orders,
      orm,
      user_id,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation Failed",
        errors: validationResult.error,
      });
    }

    // ✅ Build query using positional placeholders (?)
    const values = orders
      .map(() => `(?, ?, ?, ?, ?, ?, ?)`) // 7 placeholders for each order
      .join(", ");

    // ✅ Flatten data into a single array
    const replacements = orders.flatMap((order) => [
      gencode,
      shcode,
      ccode,
      order.grName,
      order.quantity,
      orm,
      user_id,
    ]);

    // ✅ Execute raw query
    const query = `
        INSERT INTO [csstock].[dbo].[ordCart]
        (gencode, shcode, ccode, grName, quantity, orm, userId)
        OUTPUT INSERTED.*
        VALUES ${values}
      `;

    const [result] = await req.sequelize.query(query, {
      replacements,
      type: req.sequelize.QueryTypes.INSERT,
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "Items added to cart successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error cart order:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const UpdateCart = async (req, res) => {
  try {
    const sequelize = req.sequelize;
    const { gencode, shcode, ccode, user_id, orders, orm } = req.body;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Orders array is required and must contain at least one item",
      });
    }

    // Fetch all cart records that match `shcode`, `gencode`, `ccode`, and `userId`
    const cartItems = await sequelize.query(
      `SELECT cartNo, grName FROM ordCart 
             WHERE gencode = :gencode AND shcode = :shcode AND ccode = :ccode AND userId = :user_id
             ORDER BY cartNo ASC`, // Ensure a consistent update order
      {
        replacements: { gencode, shcode, ccode, user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No matching cart items found for update",
      });
    }

    // Ensure we do not update more records than we have
    const updateCount = Math.min(cartItems.length, orders.length);

    // Update each matching cart record while maintaining the correct `grName`
    for (let i = 0; i < updateCount; i++) {
      const cartNo = cartItems[i].cartNo;
      const order = orders[i]; // Ensure the correct `grName` is applied to the right record

      await sequelize.query(
        `UPDATE ordCart 
                 SET grName = :grName, quantity = :quantity, orm = :orm, ccode = :ccode
                 WHERE cartNo = :cartNo`,
        {
          replacements: {
            grName: order.grName,
            quantity: order.quantity,
            orm,
            cartNo,
            ccode,
          },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart items updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const DeleteCart = async (req, res) => {
  try {
    const sequelize = req.sequelize;
    const { gencode, shcode, ccode, user_id, cartNos } = req.body;

    if (!gencode || !shcode || !ccode || !user_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Missing required fields: gencode, shcode, ccode, user_id",
      });
    }

    // If `cartNos` is provided, delete specific records; otherwise, delete all matching records
    let deleteQuery = `DELETE FROM ordCart WHERE gencode = :gencode AND shcode = :shcode AND ccode = :ccode AND userId = :user_id`;
    let replacements = { gencode, shcode, ccode, user_id };

    if (cartNos && Array.isArray(cartNos) && cartNos.length > 0) {
      deleteQuery += ` AND cartNo IN (:cartNos)`;
      replacements.cartNos = cartNos;
    }

    // Execute delete query
    const result = await sequelize.query(deleteQuery, {
      replacements,
      type: sequelize.QueryTypes.DELETE,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart items deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting cart items:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

// export const GetCart = async (req, res) => {
//     try {
//         const sequelize = req.sequelize;
//         const { user_id } = req.params; // Assuming user_id is passed as a route parameter

//         // Fetch cart details for the given user
//         const cartItems = await sequelize.query(
//             `SELECT cartNo, gencode, shcode, ccode, grName, quantity, orm, userId
//              FROM ordCart
//              WHERE userId = :user_id`,
//             {
//                 replacements: { user_id },
//                 type: sequelize.QueryTypes.SELECT,
//             }
//         );

//         if (cartItems.length === 0) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "No cart items found for this user",
//             });
//         }

//         // Group items where shcode, gencode, and user_id are the same
//         const groupedCart = {};
//         cartItems.forEach(item => {

//             const cartKey = `${item.gencode}-${item.shcode}-${item.userId}`; // Unique key for grouping

//             if (!groupedCart[cartKey]) {
//                 groupedCart[cartKey] = {
//                     cartNo: item.cartNo, // Pick the first cartNo for reference
//                     gencode: item.gencode,
//                     shcode: item.shcode,
//                     ccode: item.ccode,
//                     orm: item.orm,
//                     user_id: item.userId,
//                     orders: [],
//                 };
//             }

//             groupedCart[cartKey].orders.push({
//                 grName: item.grName,
//                 quantity: item.quantity,
//             });
//         });

//         // Convert grouped object into an array
//         const result = Object.values(groupedCart);

//         res.status(200).json({
//             status: 200,
//             count: result.length,
//             success: true,
//             message: "Cart items retrieved successfully",
//             data: result,
//         });

//     } catch (error) {
//         console.error("Error fetching cart:", error);
//         res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
//     }
// };

export const GetCart = async (req, res) => {
  try {
    const sequelize = req.sequelize;
    const { user_id } = req.params; // Assuming user_id is passed as a route parameter

    // Fetch cart details for the given user
    const cartItems = await sequelize.query(
      `SELECT cartNo, gencode, shcode, ccode, grName, quantity, orm, userId 
             FROM ordCart 
             WHERE userId = :user_id`,
      {
        replacements: { user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "No cart items found for this user",
      });
    }

    // Group items where gencode, shcode, and user_id are the same
    const groupedCart = {};
    for (const item of cartItems) {
      const cartKey = `${item.gencode}-${item.shcode}-${item.userId}`;

      if (!groupedCart[cartKey]) {
        groupedCart[cartKey] = {
          cartNo: item.cartNo, // Pick the first cartNo for reference
          gencode: item.gencode,
          shcode: item.shcode,
          ccode: item.ccode,
          orm: item.orm,
          user_id: item.userId,
          orders: [],
          additionalDetails: null, // Placeholder for additional query data
        };
      }

      groupedCart[cartKey].orders.push({
        grName: item.grName,
        quantity: item.quantity,
      });
    }

    // Fetch additional details for each group
    for (const cartKey in groupedCart) {
      const { gencode, shcode, user_id } = groupedCart[cartKey];

      const additionalDetails = await sequelize.query(
        `SELECT
                    SD.GenCode,
                    CustN.CName,
                    CustN.CCode,
                    CustN.CCtName,
                    SD.ShCode,
                    SD.BtCode,
                    SD.MsCode,
                    DN.DesignName,
                    CN.CatName,
                    SH.ShName,
                    SZ.SizeName,
                    MIN(BN.BrandName)   AS FirstOfBrandName,
                    MIN(SN.SeriesName)  AS FirstOfSeriesName,
                    MIN(FG.FGName)      AS FirstOfFGName,
                    MIN(DT.DTName)      AS FirstOfDTName,
                    MIN(DS.DSName)      AS FirstOfDSName,
                    MIN(SZ.PcsBox)      AS FirstOfPcsBox,
                    MIN(SD.BtBoxWt)     AS FirstOfBtBoxWt,
                    MIN(SZ.SqFeet)      AS FirstOfSqFeet,
                    MIN(SZ.SqMtr)       AS FirstOfSqMtr,
                    MIN(DN.DesignAct)   AS FirstOfDesignAct,
                    MIN(BP.BPName)      AS FirstOfBPName,
                    MIN(MS.MsName)      AS FirstOfMsName,
                    MIN(B.BtName)       AS FirstOfBtName,
                    MIN(C.CptName)      AS FirstOfCptName,
                    MIN(PN.PrdtName)    AS FirstOfPrdtName,
                    SUM(SD.G1)          AS G1,
                    SUM(SD.G2)          AS G2,
                    SUM(SD.G3)          AS G3,
                    SUM(SD.G4)          AS G4,
                    SUM(SD.G5)          AS G5,
                    SUM(SD.Gtot)        AS Gtot,
                    SUM(SD.OQ1)         AS OQ1,
                    SUM(SD.OQ2)         AS OQ2,
                    SUM(SD.OQ3)         AS OQ3,
                    SUM(SD.OQ4)         AS OQ4,
                    SUM(SD.OQ5)         AS OQ5,
                    SUM(SD.OQtot)       AS OQtot,
                    SUM(SD.AOQ1)        AS AOQ1,
                    SUM(SD.AOQ2)        AS AOQ2,
                    SUM(SD.AOQ3)        AS AOQ3,
                    SUM(SD.AOQ4)        AS AOQ4,
                    SUM(SD.AOQ5)        AS AOQ5,
                    SUM(SD.AOQtot)      AS AOQtot,
                    SUM(SD.G1)          AS SumOfG1
                FROM
                    SubDesign AS SD
                    INNER JOIN DesignName AS DN ON SD.GenCode = DN.GenCode
                    INNER JOIN CustDesign AS CD ON CD.GenCode = DN.GenCode
                    INNER JOIN CustName AS CustN ON CustN.CCode = CD.CCode
                    INNER JOIN SizeName AS SZ ON DN.SizeCode = SZ.SizeCode
                    INNER JOIN Shade AS SH ON SD.ShCode = SH.ShCode
                    INNER JOIN BrandName AS BN ON DN.BrandCode = BN.BrandCode
                    INNER JOIN SeriesName AS SN ON DN.SeriesCode = SN.SeriesCode
                    INNER JOIN FinishGlaze AS FG ON DN.FGCode = FG.FGCode
                    INNER JOIN DesignType AS DT ON DN.DTCode = DT.DTCode
                    INNER JOIN DesignStatus AS DS ON DN.DSCode = DS.DSCode
                    INNER JOIN BPName AS BP ON DN.BPCode = BP.BPCode
                    INNER JOIN CatName AS CN ON DN.CatCode = CN.CatCode
                    INNER JOIN MfgStatus AS MS ON SD.MsCode = MS.MsCode
                    INNER JOIN Batch AS B ON SD.BtCode = B.BtCode
                    INNER JOIN Concept AS C ON DN.CptCode = C.CptCode
                    INNER JOIN PrdtName AS PN ON DN.PrdtCode = PN.PrdtCode
                WHERE DN.GenCode = :gencode 
                AND CustN.CCode = :ccode
                AND SH.ShCode = :shcode
                
                GROUP BY
                SD.GenCode,
                SD.ShCode,
                SD.BtCode,
                SD.MsCode,
                DN.DesignName,
                CN.CatName,
                SH.ShName,
                SZ.SizeName,
                CustN.CName,
                CustN.CCtName,
                CustN.CCode`,
        {
          replacements: { gencode, shcode, ccode: groupedCart[cartKey].ccode },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      groupedCart[cartKey].additionalDetails = additionalDetails[0] || null;
    }

    // Convert grouped object into an array
    const result = Object.values(groupedCart);

    res.status(200).json({
      status: 200,
      count: result.length,
      success: true,
      message: "Cart items retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const getGrName = async (req, res) => {
  try {
    let sequelize = req.sequelize;
    if (!sequelize) sequelize = await authDbConnection();

    // Fetch all records using raw SQL query
    const result = await sequelize.query(
      `SELECT GrCode, GrName, GrNameC, GrAct FROM [csstock].[dbo].[GrName];`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "records fetched successfully",
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Error fetching GrName records:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal Server Error" });
  }
};

export const getOrderDetailsByGencode_pfnameList = async (req, res) => {
  try {
    const { gencode, pfname } = req.params;
    const sequelize = req.sequelize;

    const query = `
        SELECT 
          OrdMast.OrdNo,
          MIN(OrdMast.Odate) AS FirstOfOdate,
          MIN(OrdMast.OCName) AS FirstOfOCName,
          MIN(OrdMast.OCity) AS FirstOfOCity,
          MIN(OrdMast.PlaceState) AS FirstOfPlaceState,
          MIN(OrdMast.Pline) AS FirstOfPline,
          MIN(OrdMast.OStatus) AS FirstOfOStatus,
          MIN(SEName.SEName) AS FirstOfSEName,
          SUM(CTotQty) AS TotalQty,
          SUM(Cwt) AS TotalWeight,
          SUM(RdTotQty) AS ReadyQty,
          SUM(Rdwt) AS ReadyWeight,
          SUM(NRdTotQty) AS NotReadyQty,
          SUM(NRdwt) AS NotReadyWeight,
          Batch.BtName,
          Shade.ShName,
          MfgStatus.MsName,
          PackFor.PfName,
          SUM(OrdSubItem.G1) AS SumOfG1,
          SUM(OrdSubItem.G2) AS SumOfG2,
          SUM(OrdSubItem.G3) AS SumOfG3,
          SUM(OrdSubItem.G4) AS SumOfG4,
          SUM(OrdSubItem.Gtot) AS SumOfGtot,
          OrdSubItem.OrdCN,
          OC.ReadyCount,
          OC.NotReadyCount,
          (OC.ReadyCount + OC.NotReadyCount) AS TotalCount
        FROM 
          SEName 
          INNER JOIN CustName ON SEName.SECode = CustName.SECode
          INNER JOIN OrdMast ON CustName.CCode = OrdMast.CCode
          INNER JOIN OrdSubItem ON OrdMast.OrdNo = OrdSubItem.OrdNo
          INNER JOIN SubDesign ON OrdSubItem.GenSrNo = SubDesign.GenSrNo
          INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
          INNER JOIN Batch ON SubDesign.BtCode = Batch.BtCode
          INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
          INNER JOIN MfgStatus ON SubDesign.MsCode = MfgStatus.MsCode
          INNER JOIN PackFor ON OrdSubItem.PfCode = PackFor.PfCode
          LEFT JOIN (
            SELECT 
              OrdNo,
              SUM(CASE WHEN OrdCN = 0 THEN 1 ELSE 0 END) AS ReadyCount,
              SUM(CASE WHEN OrdCN = 1 THEN 1 ELSE 0 END) AS NotReadyCount
            FROM OrdSubItem
            GROUP BY OrdNo
          ) OC ON OrdMast.OrdNo = OC.OrdNo
        WHERE 
          SubDesign.GENCODE = :gencode 
          AND PackFor.PfName = :pfname
        GROUP BY 
          OrdMast.OrdNo,
          Batch.BtName,
          Shade.ShName,
          MfgStatus.MsName,
          PackFor.PfName,
          OrdSubItem.OrdCN,
          OC.ReadyCount,
          OC.NotReadyCount
        ORDER BY 
          FirstOfOdate DESC;
      `;

    const results = await sequelize.query(query, {
      replacements: { gencode, pfname },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const scanQr = async (req, res) => {
  try {
    const { sequelize } = req;
    const { id } = req.params;

    // Fetch GenCode
    const query = `SELECT GenCode FROM DesignName WHERE DUCode = :DUcode;`;
    const [results] = await sequelize.query(query, {
      replacements: { DUcode: id },
      type: sequelize.QueryTypes.SELECT,
    });

    const GenCode = results.GenCode;
    if (!GenCode) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "GenCode is null or undefined",
      });
    }

    // Fetch Design Details
    const D_query = `
            SELECT
                SubDesign.GenCode,
                SubDesign.ShCode,
                SubDesign.BtCode,
                SubDesign.MsCode,
                DesignName.DesignName,
                CatName.CatName,
                Shade.ShName,
                SizeName.SizeName,
                MIN(BrandName.BrandName) AS FirstOfBrandName,
                MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
                MIN(FinishGlaze.FGName) AS FirstOfFGName,
                MIN(DesignType.DTName) AS FirstOfDTName,
                MIN(DesignStatus.DSName) AS FirstOfDSName,
                MIN(SizeName.PcsBox) AS FirstOfPcsBox,
                MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
                MIN(SizeName.SqFeet) AS FirstOfSqFeet,
                MIN(SizeName.SqMtr) AS FirstOfSqMtr,
                MIN(DesignName.DesignAct) AS FirstOfDesignAct,
                MIN(BPName.BPName) AS FirstOfBPName,
                SUM(SubDesign.G1) AS G1,
                SUM(SubDesign.G2) AS G2,
                SUM(SubDesign.G3) AS G3,
                SUM(SubDesign.G4) AS G4,
                SUM(SubDesign.G5) AS G5,
                SUM(SubDesign.Gtot) AS Gtot,
                SUM(SubDesign.OQ1) AS OQ1,
                SUM(SubDesign.OQ2) AS OQ2,
                SUM(SubDesign.OQ3) AS OQ3,
                SUM(SubDesign.OQ4) AS OQ4,
                SUM(SubDesign.OQ5) AS OQ5,
                SUM(SubDesign.OQtot) AS OQtot,
                SUM(SubDesign.AOQ1) AS AOQ1,
                SUM(SubDesign.AOQ2) AS AOQ2,
                SUM(SubDesign.AOQ3) AS AOQ3,
                SUM(SubDesign.AOQ4) AS AOQ4,
                SUM(SubDesign.AOQ5) AS AOQ5,
                SUM(SubDesign.AOQtot) AS AOQtot,
                SUM(SubDesign.G1) AS SumOfG1
            FROM SubDesign
            INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
            INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode
            INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
            INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode
            INNER JOIN SeriesName ON DesignName.SeriesCode = SeriesName.SeriesCode
            INNER JOIN FinishGlaze ON DesignName.FGCode = FinishGlaze.FGCode
            INNER JOIN DesignType ON DesignName.DTCode = DesignType.DTCode
            INNER JOIN DesignStatus ON DesignName.DSCode = DesignStatus.DSCode
            INNER JOIN BPName ON DesignName.BPCode = BPName.BPCode
            INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
            WHERE DesignName.GenCode LIKE :searchCondition
            GROUP BY SubDesign.GenCode, SubDesign.ShCode, SubDesign.BtCode, SubDesign.MsCode, 
                     DesignName.DesignName, CatName.CatName, Shade.ShName, SizeName.SizeName;
        `;

    const searchString = `%${GenCode}%`;
    const D_results = await sequelize.query(D_query, {
      replacements: { searchCondition: searchString },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      status: 200,
      count: D_results.length,
      success: true,
      message: "QR scan successful",
      data: D_results,
    });
  } catch (error) {
    console.error("Error scanning QR:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};

// old one
// export const getDataListV2 = async (req, res) => {
//     try {
//         const { search } = req.query;
//         const sequelize = getSequelizeInstance();

//         const searchCondition = search ? `WHERE DesignName.DesignName LIKE :search` : '';

//         //     const query = `
//         //     SELECT
//         //         DesignName.DesignName,
//         //         Shade.ShName,
//         //         SizeName.SizeName,
//         //         CatName.CatName,
//         //         SUM(SubDesign.G1) AS SumOfG1
//         //     FROM
//         //         (((DesignName
//         //         INNER JOIN SubDesign ON DesignName.GenCode = SubDesign.GenCode)
//         //         INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode)
//         //         INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode)
//         //         INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
//         //     ${searchCondition}
//         //     GROUP BY
//         //         DesignName.DesignName,
//         //         Shade.ShName,
//         //         SizeName.SizeName,
//         //         CatName.CatName,
//         //         DesignName.GenCode
//         //     HAVING
//         //         SUM(SubDesign.G1) != 0;
//         // `;

//         const query = `
//     SELECT
//         DesignName.DesignName,
//         SubDesign.GenCode,
//         SubDesign.ShCode,
//         Shade.ShName,
//         SizeName.SizeName,
//         CatName.CatName,
//         SUM(SubDesign.G1) AS SumOfG1
//     FROM
//         (((DesignName
//         INNER JOIN SubDesign ON DesignName.GenCode = SubDesign.GenCode)
//         INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode)
//         INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode)
//         INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
//     ${searchCondition}
//     GROUP BY
//         DesignName.DesignName,
//         SubDesign.GenCode, -- Added GenCode to GROUP BY
//         SubDesign.ShCode,  -- Added ShCode to GROUP BY
//         Shade.ShName,
//         SizeName.SizeName,
//         CatName.CatName
//     HAVING
//         SUM(SubDesign.G1) != 0;
// `;

//         const results = await sequelize.query(query, {
//             replacements: { search: `%${search}%` },
//             type: sequelize.QueryTypes.SELECT,
//         });

//         res.status(200).json({ status: 200, success: true, count: results.length, data: results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, success: false, message: error.message });
//     }
// }

// export const stockListData = async (req, res) => {
//     try {
//         const sequelize = getSequelizeInstance();

//         const query = `
//     -- Declare variables
// DECLARE @v_GenCode NVARCHAR(50),
//         @v_ShCode NVARCHAR(50),
//         @v_DesignName NVARCHAR(100),
//         @v_CatName NVARCHAR(100),
//         @v_ShName NVARCHAR(100),
//         @v_SizeName NVARCHAR(100),
//         @v_BrandName NVARCHAR(100),
//         @v_SeriesName NVARCHAR(100),
//         @v_FGName NVARCHAR(100),
//         @v_DTName NVARCHAR(100),
//         @v_DSName NVARCHAR(100),
//         @v_PcsBox INT,
//         @v_BtBoxWt DECIMAL(18, 2),
//         @v_SqFeet NVARCHAR(100),
//         @v_SqMtr NVARCHAR(100),
//         @v_DesignAct NVARCHAR(100),
//         @v_BPName NVARCHAR(100),
//         @v_G1 DECIMAL(10, 2),
//         @v_G2 DECIMAL(10, 2),
//         @v_G3 DECIMAL(10, 2),
//         @v_G4 DECIMAL(10, 2),
//         @v_G5 DECIMAL(10, 2),
//         @v_Gtot DECIMAL(10, 2),
//         @v_OQ1 DECIMAL(10, 2),
//         @v_OQ2 DECIMAL(10, 2),
//         @v_OQ3 DECIMAL(10, 2),
//         @v_OQ4 DECIMAL(10, 2),
//         @v_OQ5 DECIMAL(10, 2),
//         @v_OQtot DECIMAL(10, 2),
//         @v_AOQ1 DECIMAL(10, 2),
//         @v_AOQ2 DECIMAL(10, 2),
//         @v_AOQ3 DECIMAL(10, 2),
//         @v_AOQ4 DECIMAL(10, 2),
//         @v_AOQ5 DECIMAL(10, 2),
//         @v_AOQtot DECIMAL(10, 2),
//         @v_PfCode NVARCHAR(50),
//         @v_OrderQty DECIMAL(10, 2),
//         @v_CurrStockQty DECIMAL(10, 2),
//         @v_AfterOrderQty DECIMAL(10, 2);

// -- Create temporary table
// CREATE TABLE #TempTable (
//     GenCode NVARCHAR(50),
//     ShCode NVARCHAR(50),
//     DesignName NVARCHAR(100),
//     CatName NVARCHAR(100),
//     ShName NVARCHAR(100),
//     SizeName NVARCHAR(100),
//     BrandName NVARCHAR(100),
//     SeriesName NVARCHAR(100),
//     FGName NVARCHAR(100),
//     DTName NVARCHAR(100),
//     DSName NVARCHAR(100),
//     PcsBox INT,
//     BtBoxWt DECIMAL(18, 2),
//     SqFeet NVARCHAR(100),
//     SqMtr NVARCHAR(100),
//     DesignAct NVARCHAR(100),
//     BPName NVARCHAR(100),
//     G1 DECIMAL(18, 2),
//     G2 DECIMAL(18, 2),
//     G3 DECIMAL(18, 2),
//     G4 DECIMAL(18, 2),
//     G5 DECIMAL(18, 2),
//     Gtot DECIMAL(18, 2),
//     OQ1 DECIMAL(18, 2),
//     OQ2 DECIMAL(18, 2),
//     OQ3 DECIMAL(18, 2),
//     OQ4 DECIMAL(18, 2),
//     OQ5 DECIMAL(18, 2),
//     OQtot DECIMAL(18, 2),
//     AOQ1 DECIMAL(18, 2),
//     AOQ2 DECIMAL(18, 2),
//     AOQ3 DECIMAL(18, 2),
//     AOQ4 DECIMAL(18, 2),
//     AOQ5 DECIMAL(18, 2),
//     AOQtot DECIMAL(18, 2),
//     OrderQty DECIMAL(10, 2),
//     AfterOrderQty DECIMAL(10, 2)
// );

// -- Define cursor
// DECLARE cur CURSOR FOR
// SELECT
//     SubDesign.GenCode,
//     SubDesign.ShCode,
//     DesignName.DesignName,
//     CatName.CatName,
//     Shade.ShName,
//     SizeName.SizeName,
//     MIN(BrandName.BrandName) AS FirstOfBrandName,
//     MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
//     MIN(FinishGlaze.FGName) AS FirstOfFGName,
//     MIN(DesignType.DTName) AS FirstOfDTName,
//     MIN(DesignStatus.DSName) AS FirstOfDSName,
//     MIN(SizeName.PcsBox) AS FirstOfPcsBox,
//     MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
//     MIN(SizeName.SqFeet) AS FirstOfSqFeet,
//     MIN(SizeName.SqMtr) AS FirstOfSqMtr,
//     MIN(DesignName.DesignAct) AS FirstOfDesignAct,
//     MIN(BPName.BPName) AS FirstOfBPName,
//     SUM(SubDesign.G1) AS G1,
//     SUM(SubDesign.G2) AS G2,
//     SUM(SubDesign.G3) AS G3,
//     SUM(SubDesign.G4) AS G4,
//     SUM(SubDesign.G5) AS G5,
//     SUM(SubDesign.Gtot) AS Gtot,
//     SUM(SubDesign.OQ1) AS OQ1,
//     SUM(SubDesign.OQ2) AS OQ2,
//     SUM(SubDesign.OQ3) AS OQ3,
//     SUM(SubDesign.OQ4) AS OQ4,
//     SUM(SubDesign.OQ5) AS OQ5,
//     SUM(SubDesign.OQtot) AS OQtot,
//     SUM(SubDesign.AOQ1) AS AOQ1,
//     SUM(SubDesign.AOQ2) AS AOQ2,
//     SUM(SubDesign.AOQ3) AS AOQ3,
//     SUM(SubDesign.AOQ4) AS AOQ4,
//     SUM(SubDesign.AOQ5) AS AOQ5,
//     SUM(SubDesign.AOQtot) AS AOQtot
// FROM
//     SubDesign
//     INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode
//     INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode
//     INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode
//     INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode
//     INNER JOIN SeriesName ON DesignName.SeriesCode = SeriesName.SeriesCode
//     INNER JOIN FinishGlaze ON DesignName.FGCode = FinishGlaze.FGCode
//     INNER JOIN DesignType ON DesignName.DTCode = DesignType.DTCode
//     INNER JOIN DesignStatus ON DesignName.DSCode = DesignStatus.DSCode
//     INNER JOIN BPName ON DesignName.BPCode = BPName.BPCode
//     INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
// WHERE
//     SubDesign.Gtot <> 0
// GROUP BY
//     SubDesign.GenCode, SubDesign.ShCode, DesignName.DesignName, CatName.CatName, Shade.ShName, SizeName.SizeName;

// -- Open cursor
// OPEN cur;
// FETCH NEXT FROM cur INTO
//     @v_GenCode, @v_ShCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
//     @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
//     @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
//     @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
//     @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
//     @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot;

// -- Process each row
// WHILE @@FETCH_STATUS = 0
// BEGIN
//     -- Get PfCode
//     SELECT @v_PfCode = PfCode
//     FROM PackFor
//     WHERE PfName = @v_ShName;

//     -- Calculate OrderQty
//     SELECT @v_OrderQty = ISNULL(SUM(OrgQty), 0)
//     FROM OrdItem
//     WHERE GenCode = @v_GenCode AND PfCode = @v_PfCode;

//     SET @v_CurrStockQty = 1000; -- Example fixed stock quantity
//     SET @v_AfterOrderQty = @v_CurrStockQty - @v_OrderQty;

//     -- Insert into temp table
//     INSERT INTO #TempTable
//     (GenCode, ShCode, DesignName, CatName, ShName, SizeName, BrandName, SeriesName, FGName, DTName, DSName, PcsBox, BtBoxWt, SqFeet, SqMtr, DesignAct, BPName, G1, G2, G3, G4, G5, Gtot, OQ1, OQ2, OQ3, OQ4, OQ5, OQtot, AOQ1, AOQ2, AOQ3, AOQ4, AOQ5, AOQtot, OrderQty, AfterOrderQty)
//     VALUES
//     (@v_GenCode, @v_ShCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
//      @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
//      @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
//      @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
//      @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
//      @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot, @v_OrderQty, @v_AfterOrderQty);

//     FETCH NEXT FROM cur INTO
//         @v_GenCode, @v_ShCode, @v_DesignName, @v_CatName, @v_ShName, @v_SizeName,
//         @v_BrandName, @v_SeriesName, @v_FGName, @v_DTName, @v_DSName, @v_PcsBox,
//         @v_BtBoxWt, @v_SqFeet, @v_SqMtr, @v_DesignAct, @v_BPName,
//         @v_G1, @v_G2, @v_G3, @v_G4, @v_G5, @v_Gtot,
//         @v_OQ1, @v_OQ2, @v_OQ3, @v_OQ4, @v_OQ5, @v_OQtot,
//         @v_AOQ1, @v_AOQ2, @v_AOQ3, @v_AOQ4, @v_AOQ5, @v_AOQtot;
// END;

// -- Close and deallocate cursor
// CLOSE cur;
// DEALLOCATE cur;

// -- Return results
// SELECT * FROM #TempTable;

// -- Drop temp table
// DROP TABLE #TempTable;
// `;

//         const results = await sequelize.query(query, {
//             type: sequelize.QueryTypes.SELECT,
//         });

//         res.status(200).json({ status: 200, success: true, count: results.length, data: results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, success: false, message: error.message });
//     }
// }

// export const productDescriptionData = async (req, res) => {
//     try {
//         const sequelize = getSequelizeInstance();

//         //         const query = `
//         //         SELECT
//         //     SubDesign.GenCode,
//         //     SubDesign.ShCode,
//         //     MIN(BrandName.BrandName) AS FirstOfBrandName,
//         //     MIN(SizeName.SizeName) AS FirstOfSizeName,
//         //     MIN(CatName.CatName) AS FirstOfCatName,
//         //     MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
//         //     MIN(FinishGlaze.FGName) AS FirstOfFGName,
//         //     MIN(DesignType.DTName) AS FirstOfDTName,
//         //     MIN(DesignStatus.DSName) AS FirstOfDSName,
//         //     MIN(SizeName.PcsBox) AS FirstOfPcsBox,
//         //     MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
//         //     MIN(SizeName.SqFeet) AS FirstOfSqFeet,
//         //     MIN(SizeName.SqMtr) AS FirstOfSqMtr,
//         //     MIN(DesignName.DesignAct) AS FirstOfDesignAct,
//         //     MIN(BPName.BPName) AS FirstOfBPName
//         // FROM
//         //     (((((((((SubDesign
//         //     INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode)
//         //     INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode)
//         //     INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode)
//         //     INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode)
//         //     INNER JOIN SeriesName ON DesignName.SeriesCode = SeriesName.SeriesCode)
//         //     INNER JOIN FinishGlaze ON DesignName.FGCode = FinishGlaze.FGCode)
//         //     INNER JOIN DesignType ON DesignName.DTCode = DesignType.DTCode)
//         //     INNER JOIN DesignStatus ON DesignName.DSCode = DesignStatus.DSCode)
//         //     INNER JOIN BPName ON DesignName.BPCode = BPName.BPCode)
//         //     INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
//         // GROUP BY
//         //     SubDesign.GenCode,
//         //     SubDesign.ShCode;
//         //     `;

//         //         const results = await sequelize.query(query, {
//         //             type: sequelize.QueryTypes.SELECT,
//         //         });

//         const genCode = req.params.gencode;
//         const shCode = req.params.shcode;

//         const query = `
// SELECT
//     SubDesign.GenCode,
//     SubDesign.ShCode,
//     MIN(BrandName.BrandName) AS FirstOfBrandName,
//     MIN(SizeName.SizeName) AS FirstOfSizeName,
//     MIN(CatName.CatName) AS FirstOfCatName,
//     MIN(SeriesName.SeriesName) AS FirstOfSeriesName,
//     MIN(FinishGlaze.FGName) AS FirstOfFGName,
//     MIN(DesignType.DTName) AS FirstOfDTName,
//     MIN(DesignStatus.DSName) AS FirstOfDSName,
//     MIN(SizeName.PcsBox) AS FirstOfPcsBox,
//     MIN(SubDesign.BtBoxWt) AS FirstOfBtBoxWt,
//     MIN(SizeName.SqFeet) AS FirstOfSqFeet,
//     MIN(SizeName.SqMtr) AS FirstOfSqMtr,
//     MIN(DesignName.DesignAct) AS FirstOfDesignAct,
//     MIN(BPName.BPName) AS FirstOfBPName
// FROM
//     (((((((((SubDesign
//     INNER JOIN DesignName ON SubDesign.GenCode = DesignName.GenCode)
//     INNER JOIN SizeName ON DesignName.SizeCode = SizeName.SizeCode)
//     INNER JOIN Shade ON SubDesign.ShCode = Shade.ShCode)
//     INNER JOIN BrandName ON DesignName.BrandCode = BrandName.BrandCode)
//     INNER JOIN SeriesName ON DesignName.SeriesCode = SeriesName.SeriesCode)
//     INNER JOIN FinishGlaze ON DesignName.FGCode = FinishGlaze.FGCode)
//     INNER JOIN DesignType ON DesignName.DTCode = DesignType.DTCode)
//     INNER JOIN DesignStatus ON DesignName.DSCode = DesignStatus.DSCode)
//     INNER JOIN BPName ON DesignName.BPCode = BPName.BPCode)
//     INNER JOIN CatName ON DesignName.CatCode = CatName.CatCode
// WHERE
//     SubDesign.GenCode = :genCode AND
//     SubDesign.ShCode = :shCode
// GROUP BY
//     SubDesign.GenCode,
//     SubDesign.ShCode;
// `;

//         const results = await sequelize.query(query, {
//             type: sequelize.QueryTypes.SELECT,
//             replacements: { genCode, shCode }, // Pass GenCode and ShCode values as parameters
//         });

//         res.status(200).json({ status: 200, success: true, count: results.length, data: results });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, success: false, message: error.message });
//     }
// }
