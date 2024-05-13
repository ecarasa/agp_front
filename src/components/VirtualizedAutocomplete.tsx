import * as React from 'react';
import { CircularProgress, TextField, capitalize } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];

    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING
    };

    if (dataSet.hasOwnProperty('group')) {
        return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
        );
    }

    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            {`${dataSet[1].id} - ${dataSet[1].nombre} ${
                dataSet[1]?.pais?.nombre ? `- ${capitalize(dataSet[1]?.pais?.nombre)}` : ''
            }`}
        </Typography>
    );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

const ListboxComponent = React.memo(
    React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(function ListboxComponent(
        props,
        ref
    ) {
        const { children, ...other } = props;
        const itemData: React.ReactChild[] = [];
        (children as React.ReactChild[]).forEach(
            (item: React.ReactChild & { children?: React.ReactChild[] }) => {
                itemData.push(item);
                itemData.push(...(item.children || []));
            }
        );

        const theme = useTheme();
        const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
            noSsr: true
        });
        const itemCount = itemData.length;
        const itemSize = smUp ? 36 : 48;

        const getChildSize = (child: React.ReactChild) => {
            if (child.hasOwnProperty('group')) {
                return 48;
            }

            return itemSize;
        };

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
        };

        const gridRef = useResetCache(itemCount);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={(index) => getChildSize(itemData[index])}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    })
);

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0
        }
    }
});

export default function VirtualizedAutocomplete({
    options,
    value,
    onChange,
    templateLabel,
    label,
    loading,
    hiddeArrow,
    type,
    name,
    required
}: any) {
    return (
        <Autocomplete
            id="virtualize-demo"
            value={value || null}
            disableListWrap
            loading={loading}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option: any) => {
                return templateLabel ? templateLabel(option) : option?.nombre;
            }}
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={options || []}
            onChange={(_: any, value: any) => {
                onChange(value);
            }}
            freeSolo={hiddeArrow}
            renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
            renderGroup={(params) => params as unknown as React.ReactNode}
            renderInput={(params: any) => (
                <TextField
                    required={required}
                    {...params}
                    label={label}
                    name={name}
                    InputProps={{
                        ...params.InputProps,
                        onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                e.stopPropagation();
                            }
                        },
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}

                                {type === 'search' ? (
                                    <>
                                        {params.InputProps.endAdornment}
                                        {!params.inputProps.value && (
                                            <SearchIcon color="primary" fontSize="medium" />
                                        )}
                                    </>
                                ) : (
                                    params.InputProps.endAdornment
                                )}
                            </>
                        )
                    }}
                />
            )}
        />
    );
}
