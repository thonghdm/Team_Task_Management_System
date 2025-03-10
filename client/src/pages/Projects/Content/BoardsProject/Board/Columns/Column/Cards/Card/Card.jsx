import {
  Card as CardMUI,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';
import { PeopleAlt, Comment, Attachment } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '@mui/material';
//

export default function Card({ card, onRowClick }) {
  const theme = useTheme();
  const shouldShowCardActions = () => {
    return (
      !!card?.assigned_to_id?.length ||
      !!card?.comments?.length ||
      !!card?.attachments_id?.length
    );
  };

  // drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } });
  const dndkitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <>
      <CardMUI
        ref={setNodeRef}
        style={dndkitCardStyles}
        {...attributes}
        {...listeners}
        onClick={onRowClick}  // Attach the onClick handler here
        sx={{
          borderRadius: '8px',
          cursor: 'pointer',
          overflow: 'unset',
          boxShadow:
            '-2px -3px rgba(0, 0, 0, .2), inset -2px -2px rgba(0, 0, 0, .1)',
          border: '1px solid transparent',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',


          // opacity: card.FE_PlaceholderCard ? '0' : '1',
          // minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
          // pointerEvents: card.FE_PlaceholderCard ? 'none' : 'unset',
          // position: card.FE_PlaceholderCard ? 'fixed' : 'unset',

          '&:hover': {
            boxShadow: (theme) => `2px 3px ${theme.palette.primary.light}`
          },
          '&:first-of-type': {
            marginTop: 1
          },
          '&:last-child': {
            marginBottom: 1
          }
        }}
      >
        {card?.cover && (
          <CardMedia
            sx={{ height: 140, overflow: 'hidden' }}
            image={card.cover}
          />
        )}

        <CardContent
          sx={{
            color: theme.palette.text.primary,
            padding: 1.5,
            '&:last-child': { padding: 1.5 }
          }}
        >
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3, // Tối đa 3 dòng
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {card?.task_name}
          </Typography>
        </CardContent>

        {shouldShowCardActions() && (
          <CardActions
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 0
            }}
          >
            {!!card?.assigned_to_id?.length && (
              <Button sx={{ color: theme.palette.text.primary }} startIcon={<PeopleAlt />}>
                {card.assigned_to_id?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button sx={{ color: theme.palette.text.primary }} startIcon={<Comment />}>{card.comments?.length}</Button>
            )}
            {!!card?.attachments_id?.length && (
              <Button startIcon={<Attachment />} sx={{ color: theme.palette.text.primary }}>
                {card.attachments_id?.length}
              </Button>
            )}
          </CardActions>
        )}
      </CardMUI>
    </>
  );
}
