import win32com.client as win32
import sys
import pythoncom

win32c = win32.constants


def pivot_table(wb: object, ws1: object, pt_ws: object, ws_name: str,
                pt_name: str, pt_rows: list, pt_cols: list, pt_values: list
                ):

    pc = wb.PivotCaches().Create(SourceType=win32c.xlDatabase,
                                 SourceData=ws1.UsedRange)
    pc.CreatePivotTable(
        TableDestination=f'{ws_name}!R', TableName=pt_name)
    pt = pt_ws.PivotTables(pt_name)
    for field_list, field_r in ((pt_rows, win32c.xlRowField),
                                (pt_cols, win32c.xlColumnField)):
        for i, value in enumerate(field_list):
            pt.PivotFields(value).Orientation = field_r
            pt.PivotFields(value).Position = i + 1

    for value in pt_values:
        pt.AddDataField(
            pt.PivotFields(value)).NumberFormat = ('#,##0')
    pt.PivotFields('כותרת;').ShowDetail = False
    pt.PivotFields('עץ מרכזי רווח').ShowDetail = False
    pt.PivotFields('חשבון').Subtotals = (False, False, False, False,
                                         False, False, False, False, False, False, False, False)
    pt.ShowValuesRow = True
    pt.ColumnGrand = True
    pt.RowAxisLayout(1)
    pt.TableStyle2 = "PivotStyleMedium6"
    print(pt)
    print('pivot_table')
    sys.stdout.flush()


def run_excel(f_path: str):
    excel = win32.gencache.EnsureDispatch('Excel.Application')
    excel.Visible = False
    try:
        wb = excel.Workbooks.Open(f_path)
    except pythoncom.com_error as e:
        if e.excepinfo[5] == -2146827284:
            print(
                f'failed to open spreadsheet.  Invalid fiename or location: {f_path}')
        else:
            raise e
        sys.exit(1)
    ws1 = wb.Sheets('DataSheet')
    ws2_name = 'example'
    wb.Sheets.Add().Name = ws2_name
    ws2 = wb.Sheets(ws2_name)
    pt_name = 'pivot_table'
    pt_rows = ['כותרת;', 'סעיף', 'חשבון', 'תאור חשבון']
    pt_cols = ['עץ מרכזי רווח', 'מרכז רווח']
    pt_values = ['סכום 2']

    pivot_table(wb, ws1, ws2, ws2_name, pt_name,
                pt_rows, pt_cols, pt_values)
    wb.Save()
    wb.Close()
    excel.Application.Quit()
    print('run_excel')
    sys.stdout.flush()


def main(f_path: str):
    run_excel(f_path)
    print('main')
    sys.stdout.flush()


if __name__ == "__main__":
    main(
        # "C:/Users/User/Desktop/תיקייה למחיקה/קבצים לטסט/עותק של new.xlsx"
        sys.argv[1]
    )
